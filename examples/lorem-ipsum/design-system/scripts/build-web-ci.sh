#!/bin/bash
set -eo pipefail

yarn diez compile -t web

pushd ../../example-codebases/web
  yarn
  yarn build
popd
