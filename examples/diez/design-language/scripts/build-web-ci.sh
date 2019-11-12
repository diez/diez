#!/bin/bash
set -eo pipefail

yarn diez compile -t web
pushd ../../diez.org
  yarn
  yarn build
popd
