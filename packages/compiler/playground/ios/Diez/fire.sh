#!/usr/bin/env bash
set -e
bazel build :Diez.framework --ios_multi_cpus=arm64,x86_64 --apple_platform_type=IOS -s
unzip -o bazel-bin/Diez.framework.zip
