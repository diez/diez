#!/bin/bash
set -eo pipefail

yarn diez compile -t ios --cocoapods --carthage

# Build the CocoaPods project
pushd ../../example-codebases/ios
  pod install
  xcodebuild -workspace PoodleSurf.xcworkspace -scheme PoodleSurf -sdk iphonesimulator | xcpretty
popd

# Build the Carthage project
./carthage-install.sh
pushd ../../example-codebases/ios-objc
  xcodebuild -project PoodleSurfObjC.xcodeproj -scheme PoodleSurfObjC -sdk iphonesimulator | xcpretty
popd
