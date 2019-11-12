#!/bin/bash
set -eo pipefail

yarn diez compile -t android

for d in android android-java; do
  pushd ../../example-codebases/$d
    ./gradlew build
  popd
done
