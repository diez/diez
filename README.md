# Diez

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

## Monorepo commands

 - `yarn create-package` - create a package and register it with `lerna`. This command will create a new TypeScript package in `packages/` in the `@livedesigner` namespace with a dependency on `@livedesigner/engine`. Note: this repository uses TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) and a common to optimize the development experience. When you create a package dependency on another local package, be sure to update project references in its `tsconfig.json` for an ideal editing/development experience.
 - `yarn release` - TODO.
