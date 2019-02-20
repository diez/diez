def _exec(repository_ctx, command):
    if repository_ctx.attr.trace:
        print("__EXEC", command)
    output = repository_ctx.execute(command)
    if output.return_code != 0:
        print("__OUTPUT", output.return_code, output.stdout, output.stderr)
        fail("Could not exec command " + " ".join(command))
    elif repository_ctx.attr.trace:
        print("__OUTPUT", output.return_code, output.stdout, output.stderr)

    return output

# Compiler Options

GLOBAL_COPTS = [
    '-Wnon-modular-include-in-framework-module',
    "-g",
    "-stdlib=libc++",
    "-DCOCOAPODS=1",
    "-DOBJC_OLD_DISPATCH_PROTOTYPES=0",
    "-fdiagnostics-show-note-include-stack",
    "-fno-common",
    "-fembed-bitcode-marker",
    "-fmessage-length=0",
    "-fpascal-strings",
    "-fstrict-aliasing",
    "-Wno-error=nonportable-include-path"
]

INHIBIT_WARNINGS_GLOBAL_COPTS = [
    "-Wno-everything",
]

def _fetch_remote_repo(repository_ctx, repo_tool_bin, target_name, url):
    fetch_cmd = [
        repo_tool_bin,
        target_name,
        "fetch",
        "--url",
        url,
        "--sub_dir",
        repository_ctx.attr.strip_prefix,
        "--trace",
        "true" if repository_ctx.attr.trace else "false"
    ]

    fetch_output = _exec(repository_ctx, fetch_cmd)
    if fetch_output.return_code != 0:
        fail("Could not retrieve pod " + target_name)

# Link a local repository into external/__TARGET_NAME__


def _link_local_repo(repository_ctx, target_name, url):
    cd = _exec(repository_ctx, ["pwd"]).stdout.split("\n")[0]
    from_dir = url + "/"
    to_dir = cd + "/"
    all_files = _exec(repository_ctx, ["ls", url]).stdout.split("\n")
    # Link all of the files at the root directly
    # ln -s url/* doesn't work.
    for repo_file in all_files:
        if len(repo_file) == 0:
            continue
        link_cmd = [
            "ln",
            "-sf",
            from_dir + repo_file,
            to_dir + repo_file
        ]
        _exec(repository_ctx, link_cmd)

def _cli_bool(b):
    if b:
        return "true"
    return "false"

REPO_TOOL_NAME = "RepoTool"
INIT_REPO_PLACEHOLDER = "__INIT_REPO__"

def _impl(repository_ctx):
    if repository_ctx.attr.trace:
        print("__RUN with repository_ctx", repository_ctx.attr)
    # Note: the root directory that these commands execute is external/name
    # after the source code has been fetched
    target_name = repository_ctx.attr.target_name
    url = repository_ctx.attr.url
    repo_tools_labels = repository_ctx.attr.repo_tools_labels
    install_script_tpl = repository_ctx.attr.install_script_tpl
    tool_bin_by_name = {}
    repo_tool_dict = repository_ctx.attr.repo_tool_dict
    inhibit_warnings = repository_ctx.attr.inhibit_warnings

    for tool_label in repo_tools_labels:
        tool_name = repo_tool_dict[str(tool_label)]
        tool_bin_by_name[tool_name] = repository_ctx.path(tool_label)

    if url.startswith("http") or url.startswith("https"):
        _fetch_remote_repo(
            repository_ctx, tool_bin_by_name[REPO_TOOL_NAME], target_name, url)
    else:
        _link_local_repo(repository_ctx, target_name, url)

    # This seems needed
    _exec(repository_ctx, ["mkdir", "-p", "external/" + target_name])

    # Build up substitutions for the install script
    substitutions = {}
    for name in tool_bin_by_name:
        # Alias the command path to the binary program
        repo_tool_bin = tool_bin_by_name.get(name)
        if not repo_tool_bin:
            fail("invalid repo_tool:" + name)

        entry = [repo_tool_bin]

        # RepoTool in this context is a special placeholder for a RepoTool
        # invocation ( INIT_REPO_PLACEHOLDER )
        if name == REPO_TOOL_NAME:
            # Set the first argument for RepoTool to "target_name"
            entry.append(target_name)
            entry.append("init")
            for user_option in repository_ctx.attr.user_options:
                entry.extend(["--user_option", "'" + user_option + "'"])

            if inhibit_warnings:
                for global_copt in INHIBIT_WARNINGS_GLOBAL_COPTS:
                    entry.extend(["--global_copt", global_copt])

            for global_copt in GLOBAL_COPTS:
                entry.extend(["--global_copt", global_copt])

            entry.extend([
                "--trace",
                _cli_bool(repository_ctx.attr.trace),
                "--enable_modules",
                _cli_bool(repository_ctx.attr.enable_modules),
                "--header_visibility",
                repository_ctx.attr.header_visibility,
                "--generate_module_map",
                _cli_bool(repository_ctx.attr.generate_module_map),
                "--vendorize",
                _cli_bool(False),
            ])
            substitutions[INIT_REPO_PLACEHOLDER] = " ".join(entry)
        else:
            substitutions[name] = " ".join(entry)

    # Build up the script
    script = ""

    # For now, we curl the podspec url before the script runs
    if repository_ctx.attr.podspec_url:
        script += "curl -O " + repository_ctx.attr.podspec_url
        script += "\n"

    if repository_ctx.attr.install_script_tpl:
        for sub in substitutions:
            install_script_tpl = install_script_tpl.replace(sub, substitutions[sub])
        script += install_script_tpl
    else:
        script += substitutions[INIT_REPO_PLACEHOLDER]

    _exec(repository_ctx, ["/bin/bash", "-c", script])


pod_repo_ = repository_rule(
    implementation=_impl,
    local=False,
    attrs={
        "target_name": attr.string(mandatory=True),
        "url": attr.string(mandatory=True),
        "podspec_url": attr.string(),
        "strip_prefix": attr.string(),
        "user_options": attr.string_list(),
        "repo_tools_labels": attr.label_list(),
        "repo_tool_dict": attr.string_dict(),
        "install_script_tpl": attr.string(),
        "inhibit_warnings": attr.bool(default=False, mandatory=True),
        "trace": attr.bool(default=False, mandatory=True),
        "enable_modules": attr.bool(default=True, mandatory=True),
        "generate_module_map": attr.bool(default=True, mandatory=True),
        "header_visibility": attr.string(),
    }
)

def new_pod_repository(name,
                       url,
                       owner="",
                       podspec_url=None,
                       strip_prefix="",
                       user_options=[],
                       install_script=None,
                       repo_tools={
                           "@rules_pods//bin:RepoTools": REPO_TOOL_NAME
                       },
                       inhibit_warnings=False,
                       trace=False,
                       enable_modules=True,
                       generate_module_map=None,
                       header_visibility="pod_support",
                       ):
    """Declare a repository for a Pod
    Args:
         name: the name of this repo

         url: the url of this repo

         podspec_url: the podspec url. By default, we will look in the root of
         the repository, and read a .podspec file. This requires having
         CocoaPods installed on build nodes. If a JSON podspec is provided here,
         then it is not required to run CocoaPods.

         owner: the owner of this dependency

         strip_prefix: a directory prefix to strip from the extracted files.
         Many archives contain a top-level directory that contains all of the
         useful files in archive.

         For most sources, this is typically not needed.

         user_options: an array of key value operators that act on code
         generated `target`s.

         Supported operators:
         PlusEquals ( += ). Add an item to an array

         Implemented for:
         `objc_library` [ `copts`, `deps`, `sdkFrameworks` ]

         Example usage: add a custom define to the target, Texture's `copts`
         field

         ```
            user_options = [ "Texture.copts += -DTEXTURE_DEBUG " ]
         ```

         install_script: a script used for installation.

         The placeholder __INIT_REPO__ indicates at which point the BUILD file is
         generated, if any.

         `repo_tools` may be provided as a label. The names provided in `repo_tools`
         are substituted out for the respective tools.

         note that the script is ran directly after the repository has been fetched.

         repo_tools: a mapping of executables in Bazel to command names.  If we
         are running something like "mv" or "sed" these binaries are already on
         path, so there is no need to add an entry for them.

         inhibit_warnings: whether compiler warnings should be inhibited.

         trace: dump out useful debug info for a given repo.

         generate_module_map: whether a module map should be generated.

         enable_modules: set generated rules enable_modules parameter

         header_visibility: DEPRECATED: This is replaced by headermaps:
         https://github.com/bazelbuild/bazel/pull/3712
    """
    if generate_module_map == None:
        generate_module_map = enable_modules

    tool_labels = []
    for tool in repo_tools:
        tool_labels.append(tool)
    pod_repo_(
        name=name,
        target_name=name,
        url=url,
        podspec_url=podspec_url,
        user_options=user_options,
        strip_prefix=strip_prefix,
        install_script_tpl=install_script,
        repo_tools_labels=tool_labels,
        repo_tool_dict=repo_tools,
        inhibit_warnings=inhibit_warnings,
        trace=trace,
        enable_modules=enable_modules,
        generate_module_map=generate_module_map,
        header_visibility=header_visibility
    )
