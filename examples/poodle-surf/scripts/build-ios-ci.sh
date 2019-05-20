#!/bin/bash
set -e

yarn diez compile -t ios --cocoapods

build () {
  pushd $1
    pod install

    xcodebuild -workspace $2.xcworkspace -scheme $2 -sdk iphonesimulator | xcpretty -t
    test ${PIPESTATUS[0]} -eq 0
  popd
}

build ios PoodleSurf
build ios-objc PoodleSurfObjC
