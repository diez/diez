#!/bin/bash
set -e

rm -rf ios/Diez
yarn diez compile -t ios -o ios --carthage

pushd ios/Diez
  git init
  git add .
  git commit --allow-empty -m "auto: initialize Diez SDK"
popd

pushd ios
  WORKING_DIR=$(pwd)
  LOCAL_REPO="${WORKING_DIR}/Diez"

  echo "git \"file://${LOCAL_REPO}\" \"master\"" > "Cartfile"

  carthage update --platform ios
popd
