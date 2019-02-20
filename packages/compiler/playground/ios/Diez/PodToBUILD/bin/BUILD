# Export this file for the repository_rule case
exports_files(["RepoTools"])

# `update_pods` Vendorizes pods
sh_binary(
    name = "update_pods",
    srcs = ["update_pods.py"],
    # Load all vendored srcs into the program
    data = ["//BazelExtensions:vendored_srcs", "RepoTools"],
    visibility = ["//visibility:public"]
)
