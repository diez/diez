# Diez &middot; [![Build Status](https://travis-ci.com/diez/diez.svg?token=R7p5y7u83p1oNU4bsu1p&branch=master)](https://travis-ci.com/diez/diez) [![codecov](https://codecov.io/gh/diez/diez/branch/master/graph/badge.svg?token=pgB9U8YLUU)](https://codecov.io/gh/diez/diez)

This is the monorepo for Diez.

## Experiencing Diez
Diez aims to make it easy to adopt a unified design language across codebases, platforms, and teams. It is intended to be used as the source of truth for your design system.

Please refer to [beta.diez.org/getting-started](https://beta.diez.org/getting-started) for installation instructions and a thorough set of getting started guides.

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
