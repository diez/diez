# Diez &middot; [![Build Status](https://travis-ci.com/diez/diez.svg?token=R7p5y7u83p1oNU4bsu1p&branch=master)](https://travis-ci.com/diez/diez) [![codecov](https://codecov.io/gh/diez/diez/branch/master/graph/badge.svg?token=pgB9U8YLUU)](https://codecov.io/gh/diez/diez)

This is the monorepo for Diez.

## Running example projects in "live" mode

Be sure to get set up for development by following the instructions in our [contributing guidelines](CONTRIBUTING.md).

 - Navigate to [examples/poodle-surf/](examples/poodle-surf).
 - iOS:
   - Run `yarn run-ios`. This will compile a Swift iOS SDK and bring up the dev server.
   - In [examples/poodle-surf/ios/](examples/poodle-surf/ios), run `pod install`.
   - Open the XCode workspace at [examples/poodle-surf/ios/PoodleSurf.xcworkspace](examples/poodle-surf/ios/PoodleSurf.xcworkspace) in Xcode.
   - Run `PoodleSurf` in an available simulator with `Cmd + R` in Xcode. You should also be able to run it on a device on the same LAN as your development machine.
 - Android:
   - Run `yarn run-android`. This will compile a Kotlin Android SDK and bring up the dev server.
   - Open the Android Studio project at [examples/poodle-surf/android](examples/poodle-surf/android).
   - Run the `app` target in an available simulator with `Ctrl + R` in Android Studio.
 - Web:
   - Run `yarn run-web`. This will compile a Web JS SDK and bring up the dev server.
   - Run `yarn serve` from [examples/poodle-surf/web](examples/poodle-surf/web).
   - Follow instructions in the console to view the app.

## Universal commands

The following commands are available in all subpackages, as well as in the monorepo itself. Running these commands in the monorepo will run across all subpackages.

 - `yarn compile` - compile all TypeScript to JS.
 - `yarn watch` - compile, then watch for changes.
 - `yarn lint` - lint TypeScript sources.
 - `yarn fix` - lint and automatically fix any automatically fixable lint issues found.
 - `yarn test` - run unit/integration tests.
 - `yarn health` - run tests and lint code with machine-readable outputs for CI.

## Monorepo-specific commands

 - `yarn create-package` - creates a package and registers it with `lerna`. This command will create a new TypeScript package in `packages/` in the `@diez` namespace with a dependency on `@diez/engine`.
 - `yarn create-example` - creates an example project in `examples/`.
 - `yarn docs` - generates the latest version of API docs in `./api`.
 - `yarn build-examples --target [ios|android|web]` - programatically build all example projects for a given platform.
