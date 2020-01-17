# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.2.0](https://github.com/diez/diez/compare/v10.2.0-beta.2...v10.2.0) (2020-01-17)

**Note:** Version bump only for package @diez/createproject





# [10.2.0-beta.2](https://github.com/diez/diez/compare/v10.2.0-beta.1...v10.2.0-beta.2) (2020-01-13)

**Note:** Version bump only for package @diez/createproject





# [10.2.0-beta.1](https://github.com/diez/diez/compare/v10.2.0-beta.0...v10.2.0-beta.1) (2020-01-13)

**Note:** Version bump only for package @diez/createproject





# [10.2.0-beta.0](https://github.com/diez/diez/compare/v10.1.0...v10.2.0-beta.0) (2020-01-11)


### Features

* **cli:** add full compatibility to use npm with diez ([#49](https://github.com/diez/diez/issues/49)) ([e3d04d9](https://github.com/diez/diez/commit/e3d04d9)), closes [#33](https://github.com/diez/diez/issues/33)





# [10.1.0](https://github.com/diez/diez/compare/v10.0.2...v10.1.0) (2019-12-11)

**Note:** Version bump only for package @diez/createproject





## [10.0.2](https://github.com/diez/diez/compare/v10.0.1...v10.0.2) (2019-11-21)

**Note:** Version bump only for package @diez/createproject





## [10.0.1](https://github.com/diez/diez/compare/v10.0.0...v10.0.1) (2019-11-21)

**Note:** Version bump only for package @diez/createproject





# 10.0.0 (2019-11-14)


### Features

* create @diez/framework-core ([#304](https://github.com/diez/diez/issues/304)) ([e8d2c4c](https://github.com/diez/diez/commit/e8d2c4c))





# [10.0.0-beta.6](https://github.com/diez/diez/compare/v10.0.0-beta.5...v10.0.0-beta.6) (2019-11-09)


### Features

* create @diez/framework-core ([#304](https://github.com/diez/diez/issues/304)) ([7a9369d](https://github.com/diez/diez/commit/7a9369d))





# [10.0.0-beta.5](https://github.com/diez/diez/compare/v10.0.0-beta.4...v10.0.0-beta.5) (2019-09-24)

**Note:** Version bump only for package @diez/createproject





# [10.0.0-beta.4](https://github.com/diez/diez/compare/v10.0.0-beta.3...v10.0.0-beta.4) (2019-08-09)

**Note:** Version bump only for package @diez/createproject





# [10.0.0-beta.3](https://github.com/diez/diez/compare/v10.0.0-beta.2...v10.0.0-beta.3) (2019-07-30)


### Features

* **compiler:** add support for plain TypeScript classes without decorators ([#215](https://github.com/diez/diez/issues/215)) ([59960c9](https://github.com/diez/diez/commit/59960c9))





# [10.0.0-beta.2](https://github.com/diez/diez/compare/v10.0.0-beta.1...v10.0.0-beta.2) (2019-07-16)

**Note:** Version bump only for package @diez/createproject





# [10.0.0-beta.1](https://github.com/diez/diez/compare/v10.0.0-beta.0...v10.0.0-beta.1) (2019-07-02)


### Features

* **createproject:** add a loader spinner when installing dependencies ([#179](https://github.com/diez/diez/issues/179)) ([306e081](https://github.com/diez/diez/commit/306e081))
* **createproject:** initialize a git repository when creating a new project ([#169](https://github.com/diez/diez/issues/169)) ([124f508](https://github.com/diez/diez/commit/124f508))
* **createproject:** make example project easier to follow ([#178](https://github.com/diez/diez/issues/178)) ([19fa10f](https://github.com/diez/diez/commit/19fa10f))
* **targets:** require `--js` param for web target ([#167](https://github.com/diez/diez/issues/167)) ([a4669ad](https://github.com/diez/diez/commit/a4669ad))





# [10.0.0-beta.0](https://github.com/diez/diez/compare/v10.0.0-alpha.0...v10.0.0-beta.0) (2019-06-14)


### Bug Fixes

* **createproject:** ensure node_modules is ignored in .gitignore for new projects ([35ea863](https://github.com/diez/diez/commit/35ea863))


### Features

* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/diez/diez/issues/97)) ([4b57a8e](https://github.com/diez/diez/commit/4b57a8e))
* **createproject:** `yarn create`/`npm init` starter kits for Diez ([#130](https://github.com/diez/diez/issues/130)) ([86caab2](https://github.com/diez/diez/commit/86caab2))
* add support for design language extraction for Figma files ([#140](https://github.com/diez/diez/issues/140)) ([26b6d87](https://github.com/diez/diez/commit/26b6d87))
* **createproject:** add simple start-* scripts for `diez create` example projects ([#147](https://github.com/diez/diez/issues/147)) ([5711743](https://github.com/diez/diez/commit/5711743))
* **createproject:** shore up the behavior of `diez create` ([#126](https://github.com/diez/diez/issues/126)) ([17d0202](https://github.com/diez/diez/commit/17d0202))


### Performance Improvements

* **cli:** reduce the dependency weight of the `diez` CLI ([#86](https://github.com/diez/diez/issues/86)) ([94dbee0](https://github.com/diez/diez/commit/94dbee0))


### BREAKING CHANGES

* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.
