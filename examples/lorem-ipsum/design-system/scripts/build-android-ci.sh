#!/bin/bash
set -eo pipefail

yarn diez compile -t android

pushd ../../example-codebases/android
  ./gradlew build
popd
