#!/usr/bin/env bash

bazel build :Diez.framework --ios_multi_cpus=arm64,x86_64 -s
unzip -o bazel-bin/Diez.framework.zip
