#!/bin/bash
set -e

pushd build/diez-poodle-surf-ios
  git init
  git add .
  git commit --allow-empty -m "auto: initialize Diez SDK"
popd

LOCAL_REPO=$(pwd -P)/build/diez-poodle-surf-ios

pushd ios-objc
  echo "git \"file://${LOCAL_REPO}\" \"master\"" > "Cartfile"
  carthage update --cache-builds --platform ios
popd
