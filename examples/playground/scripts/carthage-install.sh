#!/bin/bash
set -e

yarn diez compile -t ios --carthage

pushd build/diez-playground-ios
  git init
  git add .
  git commit --allow-empty -m "auto: initialize Diez SDK"
popd

LOCAL_REPO=$(pwd -P)/build/diez-playground-ios

pushd ios
  echo "git \"file://${LOCAL_REPO}\" \"master\"" > "Cartfile"
  carthage update --cache-builds --platform ios
popd
