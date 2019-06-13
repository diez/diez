# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-alpha.5](https://github.com/stristr/diez/compare/v10.0.0-alpha.4...v10.0.0-alpha.5) (2019-06-13)

**Note:** Version bump only for package poodle-surf





# [10.0.0-alpha.4](https://github.com/stristr/diez/compare/v10.0.0-alpha.3...v10.0.0-alpha.4) (2019-06-13)


### chore

* **ios:** rename `UIImage` getter on `Image` to `uiImage` ([#137](https://github.com/stristr/diez/issues/137)) ([7bbd9f5](https://github.com/stristr/diez/commit/7bbd9f5))


### Features

* **examples:** use hot updates in lorem-ipsum android example ([#136](https://github.com/stristr/diez/issues/136)) ([8cabfc4](https://github.com/stristr/diez/commit/8cabfc4))
* **ios:** remove Updatable ([#134](https://github.com/stristr/diez/issues/134)) ([cff9845](https://github.com/stristr/diez/commit/cff9845))
* add support for design system extraction for Figma files ([#140](https://github.com/stristr/diez/issues/140)) ([26b6d87](https://github.com/stristr/diez/commit/26b6d87))


### BREAKING CHANGES

* **ios:** The `image` property getter that returns a `UIImage` on the `Image` extension has been renamed `uiImage`.





# [10.0.0-alpha.3](https://github.com/stristr/diez/compare/v10.0.0-alpha.2...v10.0.0-alpha.3) (2019-06-10)

**Note:** Version bump only for package poodle-surf





# [10.0.0-alpha.2](https://github.com/stristr/diez/compare/v10.0.0-alpha.1...v10.0.0-alpha.2) (2019-06-10)

**Note:** Version bump only for package poodle-surf





# [10.0.0-alpha.1](https://github.com/stristr/diez/compare/v10.0.0-alpha.0...v10.0.0-alpha.1) (2019-06-10)


### Bug Fixes

* **createproject:** simplify `lorem-ipsum` web example ([#120](https://github.com/stristr/diez/issues/120)) ([085d1b0](https://github.com/stristr/diez/commit/085d1b0))
* **examples:** fix LoadingView initialization in PoodleSurf ([#110](https://github.com/stristr/diez/issues/110)) ([ddbcd04](https://github.com/stristr/diez/commit/ddbcd04))


### Features

* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/stristr/diez/issues/97)) ([4b57a8e](https://github.com/stristr/diez/commit/4b57a8e))
* **examples:** add web example to lorem-ipsum ([#114](https://github.com/stristr/diez/issues/114)) ([eee18f8](https://github.com/stristr/diez/commit/eee18f8))
* **examples:** use custom .ttf fonts in poodle-surf ([#96](https://github.com/stristr/diez/issues/96)) ([e731c33](https://github.com/stristr/diez/commit/e731c33))
* **ios:** use Result type for attachment subscriptions on iOS ([#79](https://github.com/stristr/diez/issues/79)) ([3e6ee84](https://github.com/stristr/diez/commit/3e6ee84))
* **targets:** add Carthage support to iOS ([#67](https://github.com/stristr/diez/issues/67)) ([31ed20f](https://github.com/stristr/diez/commit/31ed20f))


### Performance Improvements

* **cli:** reduce the dependency weight of the `diez` CLI ([#86](https://github.com/stristr/diez/issues/86)) ([94dbee0](https://github.com/stristr/diez/commit/94dbee0))


### BREAKING CHANGES

* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.





# [10.0.0-alpha.0](https://github.com/diez/diez/compare/v1.0.0-beta.5...v10.0.0-alpha.0) (2019-05-08)


### Features

* **examples:** add basic barebones of an Android app with Java ([#64](https://github.com/diez/diez/issues/64)) ([e390bd2](https://github.com/diez/diez/commit/e390bd2))
* **generation:** add basic code generation abilities for design sources ([#74](https://github.com/diez/diez/issues/74)) ([6f0b80f](https://github.com/diez/diez/commit/6f0b80f))
* **targets:** support partial patches in iOS ([#70](https://github.com/diez/diez/issues/70)) ([ad988e6](https://github.com/diez/diez/commit/ad988e6))
