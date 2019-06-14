# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-alpha.8](https://github.com/stristr/diez/compare/v10.0.0-alpha.0...v10.0.0-alpha.8) (2019-06-14)


### Bug Fixes

* **createproject:** simplify `lorem-ipsum` web example ([#120](https://github.com/stristr/diez/issues/120)) ([085d1b0](https://github.com/stristr/diez/commit/085d1b0))


### Features

* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/stristr/diez/issues/97)) ([4b57a8e](https://github.com/stristr/diez/commit/4b57a8e))
* **examples:** add web example to lorem-ipsum ([#114](https://github.com/stristr/diez/issues/114)) ([eee18f8](https://github.com/stristr/diez/commit/eee18f8))
* finalize early access guides ([#149](https://github.com/stristr/diez/issues/149)) ([f9dc8a6](https://github.com/stristr/diez/commit/f9dc8a6))


### BREAKING CHANGES

* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.
