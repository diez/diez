# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.2.0-beta.2](https://github.com/diez/diez/compare/v10.2.0-beta.1...v10.2.0-beta.2) (2020-01-13)

**Note:** Version bump only for package @types/diez





# [10.2.0-beta.1](https://github.com/diez/diez/compare/v10.2.0-beta.0...v10.2.0-beta.1) (2020-01-13)

**Note:** Version bump only for package @types/diez





# [10.2.0-beta.0](https://github.com/diez/diez/compare/v10.1.0...v10.2.0-beta.0) (2020-01-11)

**Note:** Version bump only for package @types/diez





# [10.1.0](https://github.com/diez/diez/compare/v10.0.2...v10.1.0) (2019-12-11)

**Note:** Version bump only for package @types/diez





## [10.0.2](https://github.com/diez/diez/compare/v10.0.1...v10.0.2) (2019-11-21)

**Note:** Version bump only for package @types/diez





# 10.0.0 (2019-11-14)

**Note:** Version bump only for package @types/diez





# [10.0.0-beta.6](https://github.com/diez/diez/compare/v10.0.0-beta.5...v10.0.0-beta.6) (2019-11-09)

**Note:** Version bump only for package @types/diez





# [10.0.0-beta.5](https://github.com/diez/diez/compare/v10.0.0-beta.4...v10.0.0-beta.5) (2019-09-24)

**Note:** Version bump only for package @types/diez





# [10.0.0-beta.4](https://github.com/diez/diez/compare/v10.0.0-beta.3...v10.0.0-beta.4) (2019-08-09)

**Note:** Version bump only for package @types/diez





# [10.0.0-beta.3](https://github.com/diez/diez/compare/v10.0.0-beta.2...v10.0.0-beta.3) (2019-07-30)

**Note:** Version bump only for package @types/diez





# [10.0.0-beta.2](https://github.com/diez/diez/compare/v10.0.0-beta.1...v10.0.0-beta.2) (2019-07-16)

**Note:** Version bump only for package @types/diez





# [10.0.0-beta.1](https://github.com/diez/diez/compare/v10.0.0-beta.0...v10.0.0-beta.1) (2019-07-02)


### Features

* **compiler:** add the ability to set generated SDK versions with a command line flag ([#158](https://github.com/diez/diez/issues/158)) ([bdb6c9e](https://github.com/diez/diez/commit/bdb6c9e))





# [10.0.0-beta.0](https://github.com/diez/diez/compare/v10.0.0-alpha.0...v10.0.0-beta.0) (2019-06-14)


### Features

* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/diez/diez/issues/97)) ([4b57a8e](https://github.com/diez/diez/commit/4b57a8e))
* **createproject:** add simple start-* scripts for `diez create` example projects ([#147](https://github.com/diez/diez/issues/147)) ([5711743](https://github.com/diez/diez/commit/5711743))


### BREAKING CHANGES

* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.
