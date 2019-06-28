#!/bin/bash
set -eo pipefail

yarn diez compile -t ios --cocoapods --carthage

# Build the CocoaPods project
pushd examples/ios
  pod install
  xcodebuild -workspace PoodleSurf.xcworkspace -scheme PoodleSurf -sdk iphonesimulator | xcpretty
popd

# Build the Carthage project
./scripts/carthage-install.sh
pushd examples/ios-objc
  xcodebuild -project PoodleSurfObjC.xcodeproj -scheme PoodleSurfObjC -sdk iphonesimulator | xcpretty
popd
