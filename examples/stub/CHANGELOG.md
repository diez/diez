# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-beta.4](https://github.com/diez/diez/compare/v10.0.0-beta.3...v10.0.0-beta.4) (2019-08-09)

**Note:** Version bump only for package stub





# [10.0.0-beta.3](https://github.com/diez/diez/compare/v10.0.0-beta.2...v10.0.0-beta.3) (2019-07-30)

**Note:** Version bump only for package stub





# [10.0.0-beta.2](https://github.com/diez/diez/compare/v10.0.0-beta.1...v10.0.0-beta.2) (2019-07-16)

**Note:** Version bump only for package stub





# [10.0.0-beta.1](https://github.com/diez/diez/compare/v10.0.0-beta.0...v10.0.0-beta.1) (2019-07-02)

**Note:** Version bump only for package stub





# [10.0.0-beta.0](https://github.com/diez/diez/compare/v10.0.0-alpha.0...v10.0.0-beta.0) (2019-06-14)


### Features

* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/diez/diez/issues/97)) ([4b57a8e](https://github.com/diez/diez/commit/4b57a8e))


### Performance Improvements

* **cli:** reduce the dependency weight of the `diez` CLI ([#86](https://github.com/diez/diez/issues/86)) ([94dbee0](https://github.com/diez/diez/commit/94dbee0))


### BREAKING CHANGES

* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.
