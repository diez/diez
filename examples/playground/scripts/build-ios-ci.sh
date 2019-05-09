#!/bin/bash
set -e

./scripts/carthage-install.sh

pushd ios
  xcodebuild -project HelloMyStateBag.xcodeproj -scheme HelloMyStateBag -sdk iphonesimulator | xcpretty -t
  test ${PIPESTATUS[0]} -eq 0
popd
