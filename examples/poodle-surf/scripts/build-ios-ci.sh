#!/bin/bash
set -e

yarn diez compile -t ios --cocoapods --carthage

# Build the CocoaPods project
pushd ios
  pod install
  xcodebuild -workspace PoodleSurf.xcworkspace -scheme PoodleSurf -sdk iphonesimulator | xcpretty
  test ${PIPESTATUS[0]} -eq 0
popd

# Build the Carthage project
exec ./scripts/carthage-install.sh
pushd ios-objc
  xcodebuild -project PoodleSurfObjC.xcodeproj -scheme PoodleSurfObjC -sdk iphonesimulator | xcpretty
  test ${PIPESTATUS[0]} -eq 0
popd
