load("@build_bazel_rules_apple//apple:providers.bzl", "AppleBundleInfo")
load("@build_bazel_rules_apple//apple:ios.bzl", _ios_framework = "ios_framework", _ios_static_framework = "ios_static_framework")
load("@build_bazel_rules_swift//swift:swift.bzl", "SwiftInfo")

_CPUS = {
  "ios_armv7": "arm",
  "ios_arm64": "arm64",
  "ios_i386": "x86",
  "ios_x86_64": "x86_64",
}

_SCRIPT = """\
{zipper} x {framework}
{zipper} c {new_framework} $(find {framework_name} -type f) $@
rm -rf {framework}
"""

def _module_zipper_arg(framework, module_name, cpu, file):
    return "{framework}/Modules/{module_name}.swiftmodule/{cpu}.{ext}={file_path}".format(
        framework = framework,
        module_name = module_name,
        cpu = cpu,
        ext = file.extension,
        file_path = file.path,
    )

def _objc_headers_impl(ctx):
    headers = []
    for dep in ctx.attr.deps:
        objc_headers = dep[apple_common.Objc].header.to_list()
        for hdr in objc_headers:
            if hdr.owner == dep.label:
                headers.append(hdr)
    return [
        DefaultInfo(
            files = depset(headers),
        ),
    ]

_objc_headers = rule(
    _objc_headers_impl,
    attrs = {
        "deps": attr.label_list(
            providers = [SwiftInfo],
        ),
    },
)

def _framework_swift_postprocess_impl(ctx):
    bundle_info = ctx.attr.framework[AppleBundleInfo]
    framework_name = bundle_info.bundle_name + bundle_info.bundle_extension
    new_framework = ctx.actions.declare_file(ctx.label.name + ".zip")
    infiles = [
        ctx.file.framework,
    ]
    zipper_args = []
    for arch, deps in ctx.split_attr.deps.items():
        cpu = _CPUS.get(arch)
        if not cpu:
            continue
        for d in deps:
            objc_info = d[apple_common.Objc]
            swift_info = d[SwiftInfo]
            swiftmodule = swift_info.direct_swiftmodules[0]
            swiftdoc = swift_info.direct_swiftdocs[0]
            infiles.extend([swiftmodule, swiftdoc])
            zipper_args.extend([
                _module_zipper_arg(framework_name, swift_info.module_name, cpu, swiftmodule),
                _module_zipper_arg(framework_name, swift_info.module_name, cpu, swiftdoc),
            ])

    ctx.actions.run_shell(
        inputs = infiles,
        outputs = [new_framework],
        mnemonic = "SwiftFrameworkPostProcess",
        progress_message = "Postprocessing %s for Swift support" % framework_name,
        command = _SCRIPT.format(
            framework = ctx.file.framework.path,
            framework_name = framework_name,
            new_framework = new_framework.path,
            zipper = ctx.executable._zipper.path,
        ),
        arguments = zipper_args,
        tools = [
            ctx.executable._zipper,
        ],
    )
    return [
        DefaultInfo(
            files = depset([new_framework]),
        ),
    ]

_framework_swift_postprocess = rule(
    _framework_swift_postprocess_impl,
    attrs = {
        "platform_type": attr.string(),
        "minimum_os_version": attr.string(),
        "framework": attr.label(
            providers = [AppleBundleInfo],
            allow_single_file = True,
        ),
        "deps": attr.label_list(
            providers = [SwiftInfo],
            cfg = apple_common.multi_arch_split,
        ),
        "_zipper": attr.label(
            default = "@bazel_tools//tools/zip:zipper",
            cfg = "host",
            executable = True,
        ),
    },
)

def ios_framework(name, minimum_os_version, hdrs=[], deps=[], visibility=None, **kwargs):
    _objc_headers(
        name = name + ".hdrs",
        deps = deps,
    )
    _ios_framework(
        name = name + ".intermediate",
        hdrs = hdrs + [name + ".hdrs"],
        minimum_os_version = minimum_os_version,
        deps = deps,
        **kwargs
    )
    _framework_swift_postprocess(
        name = name,
        platform_type = "ios",
        minimum_os_version = minimum_os_version,
        framework = name + ".intermediate",
        deps = deps,
        visibility = visibility,
)

def ios_static_framework(name, minimum_os_version, hdrs=[], deps=[], visibility=None, **kwargs):
    _objc_headers(
        name = name + ".hdrs",
        deps = deps,
    )
    _ios_static_framework(
        name = name + ".intermediate",
        hdrs = hdrs + [name + ".hdrs"],
        minimum_os_version = minimum_os_version,
        deps = deps,
        **kwargs
    )
    _framework_swift_postprocess(
        name = name,
        platform_type = "ios",
        minimum_os_version = minimum_os_version,
        framework = name + ".intermediate",
        deps = deps,
        visibility = visibility,
)
