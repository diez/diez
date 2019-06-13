# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-alpha.7](https://github.com/diez/diez/compare/v10.0.0-alpha.6...v10.0.0-alpha.7) (2019-06-13)

**Note:** Version bump only for package @diez/targets





# [10.0.0-alpha.6](https://github.com/diez/diez/compare/v10.0.0-alpha.5...v10.0.0-alpha.6) (2019-06-13)

**Note:** Version bump only for package @diez/targets





# [10.0.0-alpha.5](https://github.com/diez/diez/compare/v10.0.0-alpha.4...v10.0.0-alpha.5) (2019-06-13)

**Note:** Version bump only for package @diez/targets





# [10.0.0-alpha.4](https://github.com/diez/diez/compare/v10.0.0-alpha.3...v10.0.0-alpha.4) (2019-06-13)


### Bug Fixes

* **ios:** save component state after an update ([#139](https://github.com/diez/diez/issues/139)) ([9f188fc](https://github.com/diez/diez/commit/9f188fc))


### chore

* **ios:** rename `UIImage` getter on `Image` to `uiImage` ([#137](https://github.com/diez/diez/issues/137)) ([7bbd9f5](https://github.com/diez/diez/commit/7bbd9f5))


### Features

* **createproject:** `yarn create`/`npm init` starter kits for Diez ([#130](https://github.com/diez/diez/issues/130)) ([86caab2](https://github.com/diez/diez/commit/86caab2))
* **ios:** remove Updatable ([#134](https://github.com/diez/diez/issues/134)) ([cff9845](https://github.com/diez/diez/commit/cff9845))
* add support for design system extraction for Figma files ([#140](https://github.com/diez/diez/issues/140)) ([26b6d87](https://github.com/diez/diez/commit/26b6d87))


### BREAKING CHANGES

* **ios:** The `image` property getter that returns a `UIImage` on the `Image` extension has been renamed `uiImage`.





# [10.0.0-alpha.3](https://github.com/diez/diez/compare/v10.0.0-alpha.2...v10.0.0-alpha.3) (2019-06-10)

**Note:** Version bump only for package @diez/targets





# [10.0.0-alpha.2](https://github.com/diez/diez/compare/v10.0.0-alpha.1...v10.0.0-alpha.2) (2019-06-10)

**Note:** Version bump only for package @diez/targets





# [10.0.0-alpha.1](https://github.com/diez/diez/compare/v10.0.0-alpha.0...v10.0.0-alpha.1) (2019-06-10)


### Bug Fixes

* **createproject:** simplify `lorem-ipsum` web example ([#120](https://github.com/diez/diez/issues/120)) ([085d1b0](https://github.com/diez/diez/commit/085d1b0))
* **ios:** make component properties public internal(set) ([#83](https://github.com/diez/diez/issues/83)) ([4119665](https://github.com/diez/diez/commit/4119665))


### Features

* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/diez/diez/issues/97)) ([4b57a8e](https://github.com/diez/diez/commit/4b57a8e))
* **createproject:** shore up the behavior of `diez create` ([#126](https://github.com/diez/diez/issues/126)) ([17d0202](https://github.com/diez/diez/commit/17d0202))
* **examples:** add android example to lorem-ipsum ([#113](https://github.com/diez/diez/issues/113)) ([12797c8](https://github.com/diez/diez/commit/12797c8))
* **ios:** generate asset catalog for images ([#87](https://github.com/diez/diez/issues/87)) ([806a331](https://github.com/diez/diez/commit/806a331))
* **ios:** throw and error when NSAllowsLocalNetworking is not set to true ([#90](https://github.com/diez/diez/issues/90)) ([7692103](https://github.com/diez/diez/commit/7692103))
* **ios:** use Result type for attachment subscriptions on iOS ([#79](https://github.com/diez/diez/issues/79)) ([3e6ee84](https://github.com/diez/diez/commit/3e6ee84))
* **targets:** add Carthage support to iOS ([#67](https://github.com/diez/diez/issues/67)) ([31ed20f](https://github.com/diez/diez/commit/31ed20f))
* **targets:** Lottie & Animator config options ([#66](https://github.com/diez/diez/issues/66)) ([c7328e3](https://github.com/diez/diez/commit/c7328e3))


### Performance Improvements

* **cli:** reduce the dependency weight of the `diez` CLI ([#86](https://github.com/diez/diez/issues/86)) ([94dbee0](https://github.com/diez/diez/commit/94dbee0))


### BREAKING CHANGES

* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.





# [10.0.0-alpha.0](https://github.com/diez/diez/compare/v1.0.0-beta.5...v10.0.0-alpha.0) (2019-05-08)


### Bug Fixes

* **android:** remove inadvertent dependency on image resources in dev mode ([#65](https://github.com/diez/diez/issues/65)) ([066f3e2](https://github.com/diez/diez/commit/066f3e2))


### Features

* **examples:** add basic barebones of an Android app with Java ([#64](https://github.com/diez/diez/issues/64)) ([e390bd2](https://github.com/diez/diez/commit/e390bd2))
* **generation:** add basic code generation abilities for design sources ([#74](https://github.com/diez/diez/issues/74)) ([6f0b80f](https://github.com/diez/diez/commit/6f0b80f))
* **targets:** support partial patches in iOS ([#70](https://github.com/diez/diez/issues/70)) ([ad988e6](https://github.com/diez/diez/commit/ad988e6))
