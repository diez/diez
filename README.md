# Diez &middot; [![Build Status](https://travis-ci.com/diez/diez.svg?token=R7p5y7u83p1oNU4bsu1p&branch=master)](https://travis-ci.com/diez/diez) [![codecov](https://codecov.io/gh/diez/diez/branch/master/graph/badge.svg?token=pgB9U8YLUU)](https://codecov.io/gh/diez/diez)

This is the `diez` monorepo.

## Quick-start

 - Set up Node:
    - Get NVM:
      `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
    - Get Node:
      `nvm install 10.15.3 && nvm alias default 10.15.3`
    - Get Yarn:
      `curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.15.2`
 - Set up the Yarn workspace by running: `yarn`
 - Bootstrap local modules by running: `yarn lerna bootstrap`
 - Ensure you are equipped for native development. [macOS instructions](docs/ide-setup-macos.md) are available.

## Native build requirements (macOS)
 - Xcode >= version 10.1 and Android Studio >= version 3.3.1. See [IDE setup instructions](../../docs/ide-setup-macos.md) for details. For Xcode, CocoaPods is required for some functionality. Run `sudo gem install cocoapods` to install CocoaPods.

## Developing `yarn` commands

 - Commands are stored in the [scripts/commands/](scripts/commands) directory. To add a new command, register it in [scripts/cli.ts](scripts/cli.ts) and (recommended) create a shortcut for it in `package.json`.

## Universal commands

The following commands are available in all subpackages, as well as in the monorepo itself. Running these commands in the monorepo will run across all subpackages.

 - `yarn compile` - compile all TypeScript to JS.
 - `yarn watch` - compile, then watch for changes.
 - `yarn lint` - lint TypeScript and JS sources.
 - `yarn fix` - lint and automatically fix any automatically fixable lint issues found.
 - `yarn test` - run unit/integration tests.
 - `yarn health` - run tests and lint code with machine-readable outputs for CI.

## Running the playground project

 - Navigate to [examples/playground/](examples/playground).
 - iOS:
   - Run `yarn run-ios`. This will compile a Swift iOS SDK and bring up the dev server.
   - In [examples/playground/ios/](examples/playground/ios), run `pod install`.
   - Open the XCode workspace at [examples/playground/ios/HelloMyStateBag.xcworkspace](examples/playground/ios/HelloMyStateBag.xcworkspace) in Xcode.
   - Run `HelloMyStateBag` in an available simulator with `Cmd + R` in Xcode. You should also be able to run it on a device on the same LAN as your development machine.
 - Android:
   - Run `yarn run-android` (TODO). This will compile a Kotlin Android SDK and bring up the dev server.
   - Open the Android Studio project at [examples/playground/android](examples/playground/android).
   - Run `HelloMyStateBag` in an available simulator with `Ctrl + R` in Android Studio. Note that the `settings.xml` in the `Diez` module is preconfigured for AVD emulators, which simulate localhost URLs at the IP `10.0.2.2`. If you are using a different emulator, you may need to use a different URL. To run on a device, modify `settings.xml` to point to your LAN IP while on the same Wifi network as your development machine.

## Monorepo commands

 - `yarn create-package` - creates a package and registers it with `lerna`. This command will create a new TypeScript package in `packages/` in the `@diez` namespace with a dependency on `@diez/engine`. Note: this repository uses TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) and a common to optimize the development experience. When you create a package dependency on another local package, be sure to update project references in its `tsconfig.json` for an ideal editing/development experience.
 - `yarn docs` - generates the latest version of API docs in `./api`.
