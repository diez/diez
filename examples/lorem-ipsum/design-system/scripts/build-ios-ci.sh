#!/bin/bash
set -eo pipefail

yarn diez compile -t ios --cocoapods

pushd ../../example-codebases/ios
  pod install
  xcodebuild -workspace LoremIpsum.xcworkspace -scheme LoremIpsum -sdk iphonesimulator | xcpretty
popd
