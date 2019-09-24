#!/bin/bash -f

if [ -e ".watching" ]; then
  echo "Unable to clean with an active TS watcher."
  echo "Stop watching files and try again."
  echo "If you received this message in error, please manually remove .watching first."
  exit 1
fi

# Clean that are ignored by Git.
for name in api yarn-error.log; do
  rm -rf $name
done

# Clean generated files from packages.
for root in cli compiler extractors framework utils; do
  for package in $(ls src/$root); do
    for file in coverage lib types tsconfig.tsbuildinfo yarn-error.log test-result.tap cobertura-coverage.xml checkstyle-result.xml; do
      TARGET=src/$root/$package/$file
      if [ -e $TARGET ]; then
        rm -rf $TARGET
        echo "cleaned $TARGET"
      fi
    done
  done
done

while test $# -gt 0; do
  case "$1" in
    --no-install)
      exit 0
  esac
done

# Run yarn to sync dependencies and regenerate files.
yarn
