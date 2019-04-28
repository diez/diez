Thank you for your interest in contributing to Diez! The following guidelines should help you get up to speed as a code contributor.

## Setup

The Diez monorepo is built with NodeJS `10.15.3` and Yarn `1.15.2`. The following commands should bootstrap the monorepo and get you ready for development:

 - Get NVM:
   `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
 - Install NodeJS 10.15.3:
   `nvm install 10.15.3 && nvm alias default 10.15.3`
 - Install Yarn 1.15.2:
   `curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.15.2`
 - Install dependencies and compile sources:
   `yarn`

To set up mobile development IDEs for native development, see [macOS instructions](docs/ide-setup-macos.md) here.

## Contributing code

To contribute code to Diez, please submit a pull request to the Diez monorepo. Your pull request should:
 - describe the intent and impact of your change in its description;
 - be branched from a recent commit to `master`;
 - ideally include meaningful tests, especially if newly contributed code is not covered by existing tests; and
 - pass our rigorous continuous integration health checks.

Most, but not all, of the automated health checks can be run by entering `yarn health` in the monorepo root.

Our release process uses [conventional commits](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md) (Angular style). To ensure your contributions are correctly published in a future release, be sure to prefix it with `feat:`, `fix:`, `perf:`, or `BREAKING CHANGE:`.

## Coding guidelines

The complete programmatic API for every in the monorepo package should be exported by the main file in `src/index.ts`—and accordingly, you should always import cross-package dependencies from the dependent package's name. i.e.

```
import {utility} from '@diez/package-name'; // Yes!
import {utility} from '@diez/package-name/lib/utils'; // No!
```

All _exported_ module members must include documentation. We generate our documentation using TypeDoc; you can find instructions for writing proper documentation with TypeDoc [here](https://typedoc.org/guides/doccomments/). A value should not be exported unless it needs to be used in another module.

Most packages document their internal types (interfaces, typealiases, enums, etc.) in a file located at `src/api.ts`, and provide their internal/shared utilities in a file located at `src/utils.ts`.

All other coding guidelines should be enforced by our linting rules. You can lint a package (or the entire monorepo) by running `yarn lint`, and request that the linter automatically fix all automatically fixable issues by running `yarn fix`.

## Third-party dependencies

When introducing any new third party dependencies to this project, please remember to update [NOTICE.md](./NOTICE.md) accordingly. The exact procedure will depend on the license of the new software but in general:

- If the software is licensed using MIT, X11, BSD, ISC, or similar, you are not obligated to list the project in `NOTICE.md`, although you may do so if you wish.
- If the software is licensed under Apache License 2.0, add a new item under the Apache License, including the name and a link to the project alongside copyright attributions.
- If the software is licensed using another license, please check the attribution requirements for that license.
