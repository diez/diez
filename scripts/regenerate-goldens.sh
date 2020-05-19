#!/bin/bash -f

# Clean generated files from packages.
for package in compiler/targets framework/stdlib; do
  TARGET=src/$package
  pushd $TARGET
  yarn regenerate-goldens
  pushd
  echo "regenerated goldens for $TARGET"
done
