load("@build_bazel_rules_swift//swift:swift.bzl", "swift_library")
load(":diez.bzl", "ios_framework")

package(default_visibility = ["//visibility:public"])

swift_library(
  name = "Diez",
  copts = [
    "-embed-bitcode",
  ],
  srcs = glob([
    "Sources/**/*.swift",
  ]),
)

ios_framework(
  name = "Diez.framework",
  bundle_id = "io.livedesigner.diez",
  hdrs = [
    "Sources/Diez.h",
  ],
  bundle_name = "Diez",
  families = [
    "iphone",
    "ipad",
  ],
  infoplists = [":Info.plist"],
  # TODO: What is this, actually?
  minimum_os_version = "12.1",
  deps = [
    ":Diez",
  ],
)
