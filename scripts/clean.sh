#!/bin/bash -f

if [ -e ".watching" ]; then
  echo "Unable to clean with an active TS watcher."
  echo "Stop watching files and try again."
  echo "If you received this message in error, please manually remove .watching first."
  exit 1
fi

# Clean generated files from packages.
for package in $(ls packages); do
  for file in lib types tsconfig.tsbuildinfo yarn-error.log test-result.tap cobertura-coverage.xml checkstyle-result.xml; do
    TARGET=packages/$package/$file
    if [ -e $TARGET ]; then
      rm -rf $TARGET
      echo "cleaned $TARGET"
    fi
  done
done

# Clean the stub index.ts used in integration tests.
if [ -e examples/stub/src/index.ts ]; then
  rm examples/stub/src/index.ts
fi

while test $# -gt 0; do
  case "$1" in
    --no-install)
      exit 0
  esac
done

# Run yarn to sync dependencies and regenerate files.
yarn
