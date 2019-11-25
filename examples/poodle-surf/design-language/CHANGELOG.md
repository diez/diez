# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.2](https://github.com/diez/diez/compare/v10.0.1...v10.0.2) (2019-11-21)

**Note:** Version bump only for package poodle-surf





## [10.0.1](https://github.com/diez/diez/compare/v10.0.0...v10.0.1) (2019-11-21)

**Note:** Version bump only for package poodle-surf





# 10.0.0 (2019-11-14)

**Note:** Version bump only for package poodle-surf





# [10.0.0-beta.6](https://github.com/diez/diez/compare/v10.0.0-beta.5...v10.0.0-beta.6) (2019-11-09)


### Features

* **compiler:** add support for object literal types in the Diez compiler ([#310](https://github.com/diez/diez/issues/310)) ([671b0de](https://github.com/diez/diez/commit/671b0de))
* **compiler:** track local source files for component definitions and references for component properties ([#305](https://github.com/diez/diez/issues/305)) ([bffafbc](https://github.com/diez/diez/commit/bffafbc))
* **typograph:** add textAlignment to Typograph ([#308](https://github.com/diez/diez/issues/308)) ([8af6913](https://github.com/diez/diez/commit/8af6913))





# [10.0.0-beta.5](https://github.com/diez/diez/compare/v10.0.0-beta.4...v10.0.0-beta.5) (2019-09-24)


### Features

* **stdlib:** extricate the Diez standard library as a separate package ([#286](https://github.com/diez/diez/issues/286)) ([356a23f](https://github.com/diez/diez/commit/356a23f))


### tweak

* **typograph:** make default value for shouldScale false ([#298](https://github.com/diez/diez/issues/298)) ([507754c](https://github.com/diez/diez/commit/507754c))


### BREAKING CHANGES

* **typograph:** change Typograph's default value for shouldScale to false





# [10.0.0-beta.4](https://github.com/diez/diez/compare/v10.0.0-beta.3...v10.0.0-beta.4) (2019-08-09)


### chore

* **targets:** clean up JS SDK helpers  ([#227](https://github.com/diez/diez/issues/227)) ([f2baade](https://github.com/diez/diez/commit/f2baade))


### Features

* **android:** add dpToPx and spToPx to core generated library ([#240](https://github.com/diez/diez/issues/240)) ([2a988d5](https://github.com/diez/diez/commit/2a988d5))
* **prefabs:** add DropShadow ([#225](https://github.com/diez/diez/issues/225)) ([df7182d](https://github.com/diez/diez/commit/df7182d))
* **prefabs:** add Size2D prefab ([#211](https://github.com/diez/diez/issues/211)) ([6d95d8a](https://github.com/diez/diez/commit/6d95d8a))


### BREAKING CHANGES

* **targets:** the JavaScript SDK no longer provides the `urlCss` method for `File` and `Image` prefabs.





# [10.0.0-beta.3](https://github.com/diez/diez/compare/v10.0.0-beta.2...v10.0.0-beta.3) (2019-07-30)


### Features

* **compiler:** add support for plain TypeScript classes without decorators ([#215](https://github.com/diez/diez/issues/215)) ([59960c9](https://github.com/diez/diez/commit/59960c9))
* **targets:** update lottie-android to 3.0.1 ([#206](https://github.com/diez/diez/issues/206)) ([c5a3b97](https://github.com/diez/diez/commit/c5a3b97))
* **targets:** update lottie-ios to 3.1.1 ([#203](https://github.com/diez/diez/issues/203)) ([119b85e](https://github.com/diez/diez/commit/119b85e))





# [10.0.0-beta.2](https://github.com/diez/diez/compare/v10.0.0-beta.1...v10.0.0-beta.2) (2019-07-16)


### Features

* add a new package featuring a webpack plugin to integrate Diez with web ([#193](https://github.com/diez/diez/issues/193)) ([6bd7932](https://github.com/diez/diez/commit/6bd7932))
* **examples:** use palette to map raw colors names that describe their usage ([#202](https://github.com/diez/diez/issues/202)) ([ed91430](https://github.com/diez/diez/commit/ed91430))
* **prefabs:** add linear gradient prefab ([#191](https://github.com/diez/diez/issues/191)) ([d01700a](https://github.com/diez/diez/commit/d01700a))
* **targets:** add NSAttributedString helpers for Typograph on iOS. ([#201](https://github.com/diez/diez/issues/201)) ([af93c42](https://github.com/diez/diez/commit/af93c42))





# [10.0.0-beta.1](https://github.com/diez/diez/compare/v10.0.0-beta.0...v10.0.0-beta.1) (2019-07-02)


### Code Refactoring

* **android:** improve android SDK semantics ([#160](https://github.com/diez/diez/issues/160)) ([1b1d1a6](https://github.com/diez/diez/commit/1b1d1a6))


### Features

* **compiler:** add the ability to set generated SDK versions with a command line flag ([#158](https://github.com/diez/diez/issues/158)) ([bdb6c9e](https://github.com/diez/diez/commit/bdb6c9e))
* **ios:** add Swift only UIKit class initializers for Diez types ([#159](https://github.com/diez/diez/issues/159)) ([913c54f](https://github.com/diez/diez/commit/913c54f))
* **ios:** generate SDK as a collection of files instead of a single SDK.swift ([#163](https://github.com/diez/diez/issues/163)) ([c625e08](https://github.com/diez/diez/commit/c625e08))
* **targets:** add ability to compile CSS and SCSS ([#174](https://github.com/diez/diez/issues/174)) ([26ec8fe](https://github.com/diez/diez/commit/26ec8fe))
* **targets:** require `--js` param for web target ([#167](https://github.com/diez/diez/issues/167)) ([a4669ad](https://github.com/diez/diez/commit/a4669ad))
* **targets:** revamp Web JavaScript binding helpers ([#162](https://github.com/diez/diez/issues/162)) ([55dd138](https://github.com/diez/diez/commit/55dd138))


### BREAKING CHANGES

* **android:** Extensions on Android classes that were values with a setter and a null returning getter are now functions.





# [10.0.0-beta.0](https://github.com/diez/diez/compare/v10.0.0-alpha.0...v10.0.0-beta.0) (2019-06-14)


### Bug Fixes

* **createproject:** simplify `lorem-ipsum` web example ([#120](https://github.com/diez/diez/issues/120)) ([085d1b0](https://github.com/diez/diez/commit/085d1b0))
* **examples:** fix LoadingView initialization in PoodleSurf ([#110](https://github.com/diez/diez/issues/110)) ([ddbcd04](https://github.com/diez/diez/commit/ddbcd04))
* **ios:** rename `UIImage` getter on `Image` to `uiImage` ([#137](https://github.com/diez/diez/issues/137)) ([7bbd9f5](https://github.com/diez/diez/commit/7bbd9f5))


### Features

* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/diez/diez/issues/97)) ([4b57a8e](https://github.com/diez/diez/commit/4b57a8e))
* **examples:** add web example to lorem-ipsum ([#114](https://github.com/diez/diez/issues/114)) ([eee18f8](https://github.com/diez/diez/commit/eee18f8))
* **examples:** use custom .ttf fonts in poodle-surf ([#96](https://github.com/diez/diez/issues/96)) ([e731c33](https://github.com/diez/diez/commit/e731c33))
* **examples:** use hot updates in lorem-ipsum android example ([#136](https://github.com/diez/diez/issues/136)) ([8cabfc4](https://github.com/diez/diez/commit/8cabfc4))
* **ios:** remove Updatable ([#134](https://github.com/diez/diez/issues/134)) ([cff9845](https://github.com/diez/diez/commit/cff9845))
* **ios:** use Result type for attachment subscriptions on iOS ([#79](https://github.com/diez/diez/issues/79)) ([3e6ee84](https://github.com/diez/diez/commit/3e6ee84))
* **targets:** add Carthage support to iOS ([#67](https://github.com/diez/diez/issues/67)) ([31ed20f](https://github.com/diez/diez/commit/31ed20f))
* add support for design language extraction for Figma files ([#140](https://github.com/diez/diez/issues/140)) ([26b6d87](https://github.com/diez/diez/commit/26b6d87))
* finalize early access guides ([#149](https://github.com/diez/diez/issues/149)) ([f9dc8a6](https://github.com/diez/diez/commit/f9dc8a6))


### Performance Improvements

* **cli:** reduce the dependency weight of the `diez` CLI ([#86](https://github.com/diez/diez/issues/86)) ([94dbee0](https://github.com/diez/diez/commit/94dbee0))


### BREAKING CHANGES

* **ios:** The `image` property getter that returns a `UIImage` on the `Image` extension has been renamed `uiImage`.
* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.
