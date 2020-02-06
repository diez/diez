# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.2.1](https://github.com/diez/diez/compare/v10.2.0...v10.2.1) (2020-02-06)

**Note:** Version bump only for package poodle-surf-web





# [10.2.0](https://github.com/diez/diez/compare/v10.2.0-beta.2...v10.2.0) (2020-01-17)

**Note:** Version bump only for package poodle-surf-web





# [10.2.0-beta.2](https://github.com/diez/diez/compare/v10.2.0-beta.1...v10.2.0-beta.2) (2020-01-13)

**Note:** Version bump only for package poodle-surf-web





# [10.2.0-beta.1](https://github.com/diez/diez/compare/v10.2.0-beta.0...v10.2.0-beta.1) (2020-01-13)

**Note:** Version bump only for package poodle-surf-web





# [10.2.0-beta.0](https://github.com/diez/diez/compare/v10.1.0...v10.2.0-beta.0) (2020-01-11)

**Note:** Version bump only for package poodle-surf-web





# [10.1.0](https://github.com/diez/diez/compare/v10.0.2...v10.1.0) (2019-12-11)

**Note:** Version bump only for package poodle-surf-web





## [10.0.2](https://github.com/diez/diez/compare/v10.0.1...v10.0.2) (2019-11-21)

**Note:** Version bump only for package poodle-surf-web





# 10.0.0 (2019-11-14)


### Features

* **typograph:** add textAlignment to Typograph ([#308](https://github.com/diez/diez/issues/308)) ([7da88d1](https://github.com/diez/diez/commit/7da88d1))





# [10.0.0-beta.6](https://github.com/diez/diez/compare/v10.0.0-beta.5...v10.0.0-beta.6) (2019-11-09)


### Features

* **typograph:** add textAlignment to Typograph ([#308](https://github.com/diez/diez/issues/308)) ([8af6913](https://github.com/diez/diez/commit/8af6913))





# [10.0.0-beta.5](https://github.com/diez/diez/compare/v10.0.0-beta.4...v10.0.0-beta.5) (2019-09-24)

**Note:** Version bump only for package poodle-surf-web





# [10.0.0-beta.4](https://github.com/diez/diez/compare/v10.0.0-beta.3...v10.0.0-beta.4) (2019-08-09)


### chore

* **targets:** clean up JS SDK helpers  ([#227](https://github.com/diez/diez/issues/227)) ([f2baade](https://github.com/diez/diez/commit/f2baade))


### Features

* **prefabs:** add DropShadow ([#225](https://github.com/diez/diez/issues/225)) ([df7182d](https://github.com/diez/diez/commit/df7182d))
* **prefabs:** add Size2D prefab ([#211](https://github.com/diez/diez/issues/211)) ([6d95d8a](https://github.com/diez/diez/commit/6d95d8a))


### BREAKING CHANGES

* **targets:** the JavaScript SDK no longer provides the `urlCss` method for `File` and `Image` prefabs.





# [10.0.0-beta.3](https://github.com/diez/diez/compare/v10.0.0-beta.2...v10.0.0-beta.3) (2019-07-30)

**Note:** Version bump only for package poodle-surf-web





# [10.0.0-beta.2](https://github.com/diez/diez/compare/v10.0.0-beta.1...v10.0.0-beta.2) (2019-07-16)


### Features

* add a new package featuring a webpack plugin to integrate Diez with web ([#193](https://github.com/diez/diez/issues/193)) ([6bd7932](https://github.com/diez/diez/commit/6bd7932))
* **prefabs:** add linear gradient prefab ([#191](https://github.com/diez/diez/issues/191)) ([d01700a](https://github.com/diez/diez/commit/d01700a))





# [10.0.0-beta.1](https://github.com/diez/diez/compare/v10.0.0-beta.0...v10.0.0-beta.1) (2019-07-02)

**Note:** Version bump only for package poodle-surf-web





# [10.0.0-beta.0](https://github.com/diez/diez/compare/v10.0.0-alpha.0...v10.0.0-beta.0) (2019-06-14)


### Bug Fixes

* **createproject:** simplify `lorem-ipsum` web example ([#120](https://github.com/diez/diez/issues/120)) ([085d1b0](https://github.com/diez/diez/commit/085d1b0))


### Features

* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/diez/diez/issues/97)) ([4b57a8e](https://github.com/diez/diez/commit/4b57a8e))
* **examples:** add web example to lorem-ipsum ([#114](https://github.com/diez/diez/issues/114)) ([eee18f8](https://github.com/diez/diez/commit/eee18f8))
* finalize early access guides ([#149](https://github.com/diez/diez/issues/149)) ([f9dc8a6](https://github.com/diez/diez/commit/f9dc8a6))


### BREAKING CHANGES

* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.
