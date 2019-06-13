# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-alpha.6](https://github.com/stristr/diez/compare/v10.0.0-alpha.5...v10.0.0-alpha.6) (2019-06-13)


### Bug Fixes

* ensure symlinks work for linking the example project ([a3b801c](https://github.com/stristr/diez/commit/a3b801c))





# [10.0.0-alpha.5](https://github.com/stristr/diez/compare/v10.0.0-alpha.4...v10.0.0-alpha.5) (2019-06-13)

**Note:** Version bump only for package @diez/mono





# [10.0.0-alpha.4](https://github.com/stristr/diez/compare/v10.0.0-alpha.3...v10.0.0-alpha.4) (2019-06-13)


### Bug Fixes

* **ios:** save component state after an update ([#139](https://github.com/stristr/diez/issues/139)) ([9f188fc](https://github.com/stristr/diez/commit/9f188fc))
* run CLI update check in the main thread ([#141](https://github.com/stristr/diez/issues/141)) ([739d4f3](https://github.com/stristr/diez/commit/739d4f3))


### chore

* **ios:** rename `UIImage` getter on `Image` to `uiImage` ([#137](https://github.com/stristr/diez/issues/137)) ([7bbd9f5](https://github.com/stristr/diez/commit/7bbd9f5))


### Features

* **createproject:** `yarn create`/`npm init` starter kits for Diez ([#130](https://github.com/stristr/diez/issues/130)) ([86caab2](https://github.com/stristr/diez/commit/86caab2))
* **docs:** add getting started docs for iOS ([#132](https://github.com/stristr/diez/issues/132)) ([f67f039](https://github.com/stristr/diez/commit/f67f039))
* **examples:** use hot updates in lorem-ipsum android example ([#136](https://github.com/stristr/diez/issues/136)) ([8cabfc4](https://github.com/stristr/diez/commit/8cabfc4))
* **ios:** remove Updatable ([#134](https://github.com/stristr/diez/issues/134)) ([cff9845](https://github.com/stristr/diez/commit/cff9845))
* add support for design system extraction for Figma files ([#140](https://github.com/stristr/diez/issues/140)) ([26b6d87](https://github.com/stristr/diez/commit/26b6d87))


### BREAKING CHANGES

* **ios:** The `image` property getter that returns a `UIImage` on the `Image` extension has been renamed `uiImage`.





# [10.0.0-alpha.3](https://github.com/stristr/diez/compare/v10.0.0-alpha.2...v10.0.0-alpha.3) (2019-06-10)


### Bug Fixes

* install node-fetch as a non-dev dependency of @diez/storage ([f64a365](https://github.com/stristr/diez/commit/f64a365))





# [10.0.0-alpha.2](https://github.com/stristr/diez/compare/v10.0.0-alpha.1...v10.0.0-alpha.2) (2019-06-10)

**Note:** Version bump only for package @diez/mono





# [10.0.0-alpha.1](https://github.com/stristr/diez/compare/v10.0.0-alpha.0...v10.0.0-alpha.1) (2019-06-10)


### Bug Fixes

* use normal slashes when resolving node_modules sources ([#77](https://github.com/stristr/diez/issues/77)) ([dbe02e1](https://github.com/stristr/diez/commit/dbe02e1))
* **createproject:** simplify `lorem-ipsum` web example ([#120](https://github.com/stristr/diez/issues/120)) ([085d1b0](https://github.com/stristr/diez/commit/085d1b0))
* **docs:** allow docs to be generated when the repo is in a path with ‘src’ in it ([#106](https://github.com/stristr/diez/issues/106)) ([0d2c3de](https://github.com/stristr/diez/commit/0d2c3de))
* **docs:** typos + styling ([#75](https://github.com/stristr/diez/issues/75)) ([7714a61](https://github.com/stristr/diez/commit/7714a61))
* **examples:** fix LoadingView initialization in PoodleSurf ([#110](https://github.com/stristr/diez/issues/110)) ([ddbcd04](https://github.com/stristr/diez/commit/ddbcd04))
* **ios:** fix incorrect output framework filename in carthage build phase ([#103](https://github.com/stristr/diez/issues/103)) ([292546f](https://github.com/stristr/diez/commit/292546f))
* **ios:** make component properties public internal(set) ([#83](https://github.com/stristr/diez/issues/83)) ([4119665](https://github.com/stristr/diez/commit/4119665))
* **site:** use nuxt built-in loading bar to load docs ([#89](https://github.com/stristr/diez/issues/89)) ([f45e549](https://github.com/stristr/diez/commit/f45e549))


### Features

* **cli:** add opt-out analytics to `diez` ([#92](https://github.com/stristr/diez/issues/92)) ([08291ec](https://github.com/stristr/diez/commit/08291ec))
* **cli:** allow default command options to be specified in .diezrc ([#84](https://github.com/stristr/diez/issues/84)) ([0e8a1bb](https://github.com/stristr/diez/commit/0e8a1bb))
* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/stristr/diez/issues/97)) ([4b57a8e](https://github.com/stristr/diez/commit/4b57a8e))
* **compiler:** implement canUseNpm ([#85](https://github.com/stristr/diez/issues/85)) ([e516caa](https://github.com/stristr/diez/commit/e516caa))
* **createproject:** shore up the behavior of `diez create` ([#126](https://github.com/stristr/diez/issues/126)) ([17d0202](https://github.com/stristr/diez/commit/17d0202))
* **examples:** add android example to lorem-ipsum ([#113](https://github.com/stristr/diez/issues/113)) ([12797c8](https://github.com/stristr/diez/commit/12797c8))
* **examples:** add web example to lorem-ipsum ([#114](https://github.com/stristr/diez/issues/114)) ([eee18f8](https://github.com/stristr/diez/commit/eee18f8))
* **examples:** use custom .ttf fonts in poodle-surf ([#96](https://github.com/stristr/diez/issues/96)) ([e731c33](https://github.com/stristr/diez/commit/e731c33))
* **ios:** generate asset catalog for images ([#87](https://github.com/stristr/diez/issues/87)) ([806a331](https://github.com/stristr/diez/commit/806a331))
* **ios:** throw and error when NSAllowsLocalNetworking is not set to true ([#90](https://github.com/stristr/diez/issues/90)) ([7692103](https://github.com/stristr/diez/commit/7692103))
* **ios:** use Result type for attachment subscriptions on iOS ([#79](https://github.com/stristr/diez/issues/79)) ([3e6ee84](https://github.com/stristr/diez/commit/3e6ee84))
* **services:** move Figma OAuth handshake broker into the monorepo and migrate to the serverless stack ([#94](https://github.com/stristr/diez/issues/94)) ([6f050b7](https://github.com/stristr/diez/commit/6f050b7))
* **site:** add analytics explainer page ([#93](https://github.com/stristr/diez/issues/93)) ([7f587a4](https://github.com/stristr/diez/commit/7f587a4))
* **targets:** add Carthage support to iOS ([#67](https://github.com/stristr/diez/issues/67)) ([31ed20f](https://github.com/stristr/diez/commit/31ed20f))
* add script that generates example templates for createproject ([#115](https://github.com/stristr/diez/issues/115)) ([943513c](https://github.com/stristr/diez/commit/943513c))
* **targets:** Lottie & Animator config options ([#66](https://github.com/stristr/diez/issues/66)) ([c7328e3](https://github.com/stristr/diez/commit/c7328e3))


### Performance Improvements

* **cli:** reduce the dependency weight of the `diez` CLI ([#86](https://github.com/stristr/diez/issues/86)) ([94dbee0](https://github.com/stristr/diez/commit/94dbee0))
* examples/site performance enchancements ([#91](https://github.com/stristr/diez/issues/91)) ([e6285db](https://github.com/stristr/diez/commit/e6285db))
* **site:** actually show the fallback font if the loading fails ([#95](https://github.com/stristr/diez/issues/95)) ([2aa8084](https://github.com/stristr/diez/commit/2aa8084))


### BREAKING CHANGES

* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.





# [10.0.0-alpha.0](https://github.com/diez/diez/compare/v1.0.0-beta.5...v10.0.0-alpha.0) (2019-05-08)


### Bug Fixes

* **android:** remove inadvertent dependency on image resources in dev mode ([#65](https://github.com/diez/diez/issues/65)) ([066f3e2](https://github.com/diez/diez/commit/066f3e2))


### Features

* **examples:** add basic barebones of an Android app with Java ([#64](https://github.com/diez/diez/issues/64)) ([e390bd2](https://github.com/diez/diez/commit/e390bd2))
* **generation:** add basic code generation abilities for design sources ([#74](https://github.com/diez/diez/issues/74)) ([6f0b80f](https://github.com/diez/diez/commit/6f0b80f))
* **site:** add glossary and FAQ ([#68](https://github.com/diez/diez/issues/68)) ([63b2bad](https://github.com/diez/diez/commit/63b2bad))
* **site:** integrate docs with website ([#69](https://github.com/diez/diez/issues/69)) ([3e40fb7](https://github.com/diez/diez/commit/3e40fb7))
* **targets:** support partial patches in iOS ([#70](https://github.com/diez/diez/issues/70)) ([ad988e6](https://github.com/diez/diez/commit/ad988e6))
