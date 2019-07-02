# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
* add support for design system extraction for Figma files ([#140](https://github.com/diez/diez/issues/140)) ([26b6d87](https://github.com/diez/diez/commit/26b6d87))
* finalize early access guides ([#149](https://github.com/diez/diez/issues/149)) ([f9dc8a6](https://github.com/diez/diez/commit/f9dc8a6))


### Performance Improvements

* **cli:** reduce the dependency weight of the `diez` CLI ([#86](https://github.com/diez/diez/issues/86)) ([94dbee0](https://github.com/diez/diez/commit/94dbee0))


### BREAKING CHANGES

* **ios:** The `image` property getter that returns a `UIImage` on the `Image` extension has been renamed `uiImage`.
* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.
