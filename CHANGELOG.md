# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-beta.4](https://github.com/diez/diez/compare/v10.0.0-beta.3...v10.0.0-beta.4) (2019-08-09)


### Bug Fixes

* **linear-gradient:** sanitize linear gradients so two stops are always present ([#230](https://github.com/diez/diez/issues/230)) ([65298f8](https://github.com/diez/diez/commit/65298f8))
* **site:** fix typos on Sketch guide ([#239](https://github.com/diez/diez/issues/239)) ([72422ac](https://github.com/diez/diez/commit/72422ac))


### chore

* **targets:** clean up JS SDK helpers  ([#227](https://github.com/diez/diez/issues/227)) ([f2baade](https://github.com/diez/diez/commit/f2baade))


### Features

* **android:** add dpToPx and spToPx to core generated library ([#240](https://github.com/diez/diez/issues/240)) ([2a988d5](https://github.com/diez/diez/commit/2a988d5))
* **cli:** allow users to specify an alternative project root via .diezrc ([#243](https://github.com/diez/diez/issues/243)) ([d5dfcdc](https://github.com/diez/diez/commit/d5dfcdc))
* **prefabs:** add DropShadow ([#225](https://github.com/diez/diez/issues/225)) ([df7182d](https://github.com/diez/diez/commit/df7182d))
* **prefabs:** add Size2D prefab ([#211](https://github.com/diez/diez/issues/211)) ([6d95d8a](https://github.com/diez/diez/commit/6d95d8a))
* **targets:** add missing unit types on Size2D and Point2D for generated web resources ([#238](https://github.com/diez/diez/issues/238)) ([adc9480](https://github.com/diez/diez/commit/adc9480))


### BREAKING CHANGES

* **targets:** the JavaScript SDK no longer provides the `urlCss` method for `File` and `Image` prefabs.





# [10.0.0-beta.3](https://github.com/diez/diez/compare/v10.0.0-beta.2...v10.0.0-beta.3) (2019-07-30)


### Bug Fixes

* remove `web-sdk-common` from docs ([#207](https://github.com/diez/diez/issues/207)) ([f7a196d](https://github.com/diez/diez/commit/f7a196d))
* use trusty build environment for Travis to enable support for oraclejdk8 ([#221](https://github.com/diez/diez/issues/221)) ([0b4a855](https://github.com/diez/diez/commit/0b4a855))


### Features

* **compiler:** add support for plain TypeScript classes without decorators ([#215](https://github.com/diez/diez/issues/215)) ([59960c9](https://github.com/diez/diez/commit/59960c9))
* **site:** improve <CodeTabs> to select all tabs of the same language ([#217](https://github.com/diez/diez/issues/217)) ([3b81af6](https://github.com/diez/diez/commit/3b81af6))
* **targets:** update lottie-android to 3.0.1 ([#206](https://github.com/diez/diez/issues/206)) ([c5a3b97](https://github.com/diez/diez/commit/c5a3b97))
* **targets:** update lottie-ios to 3.1.1 ([#203](https://github.com/diez/diez/issues/203)) ([119b85e](https://github.com/diez/diez/commit/119b85e))





# [10.0.0-beta.2](https://github.com/diez/diez/compare/v10.0.0-beta.1...v10.0.0-beta.2) (2019-07-16)


### Features

* add a new package featuring a webpack plugin to integrate Diez with web ([#193](https://github.com/diez/diez/issues/193)) ([6bd7932](https://github.com/diez/diez/commit/6bd7932))
* **examples:** use palette to map raw colors names that describe their usage ([#202](https://github.com/diez/diez/issues/202)) ([ed91430](https://github.com/diez/diez/commit/ed91430))
* **prefabs:** add angle static constructor to LinearGradient ([#200](https://github.com/diez/diez/issues/200)) ([ad69f6e](https://github.com/diez/diez/commit/ad69f6e))
* **prefabs:** add linear gradient prefab ([#191](https://github.com/diez/diez/issues/191)) ([d01700a](https://github.com/diez/diez/commit/d01700a))
* **site:** create and integrate a Diez project for website styles ([#182](https://github.com/diez/diez/issues/182)) ([651fe90](https://github.com/diez/diez/commit/651fe90))
* **targets:** add NSAttributedString helpers for Typograph on iOS. ([#201](https://github.com/diez/diez/issues/201)) ([af93c42](https://github.com/diez/diez/commit/af93c42))





# [10.0.0-beta.1](https://github.com/diez/diez/compare/v10.0.0-beta.0...v10.0.0-beta.1) (2019-07-02)


### Bug Fixes

* **android:** ensure hot mode webview does not cover content ([#170](https://github.com/diez/diez/issues/170)) ([d0164c9](https://github.com/diez/diez/commit/d0164c9))
* **site:** add GA tracking ([#155](https://github.com/diez/diez/issues/155)) ([4de3f71](https://github.com/diez/diez/commit/4de3f71))
* **site:** scope layout styles so docs do not receive extra styles ([#157](https://github.com/diez/diez/issues/157)) ([5089c2d](https://github.com/diez/diez/commit/5089c2d))
* ensure diez hot crashes bubble on compiler event handlers ([#172](https://github.com/diez/diez/issues/172)) ([75e0508](https://github.com/diez/diez/commit/75e0508))
* **sources:** fixes application detection when more than one installation is present ([#180](https://github.com/diez/diez/issues/180)) ([5c27f44](https://github.com/diez/diez/commit/5c27f44))


### Code Refactoring

* **android:** improve android SDK semantics ([#160](https://github.com/diez/diez/issues/160)) ([1b1d1a6](https://github.com/diez/diez/commit/1b1d1a6))


### Features

* **android:** use handlebar templates to bind real properties/functions instead of using extensions ([#173](https://github.com/diez/diez/issues/173)) ([7a53dfd](https://github.com/diez/diez/commit/7a53dfd))
* **compiler:** add the ability to set generated SDK versions with a command line flag ([#158](https://github.com/diez/diez/issues/158)) ([bdb6c9e](https://github.com/diez/diez/commit/bdb6c9e))
* **createproject:** add a loader spinner when installing dependencies ([#179](https://github.com/diez/diez/issues/179)) ([306e081](https://github.com/diez/diez/commit/306e081))
* **createproject:** add comments in example projects that lead a viewer back to the TypeScript definitions ([#176](https://github.com/diez/diez/issues/176)) ([3ed19c1](https://github.com/diez/diez/commit/3ed19c1))
* **createproject:** initialize a git repository when creating a new project ([#169](https://github.com/diez/diez/issues/169)) ([124f508](https://github.com/diez/diez/commit/124f508))
* **createproject:** make example project easier to follow ([#178](https://github.com/diez/diez/issues/178)) ([19fa10f](https://github.com/diez/diez/commit/19fa10f))
* **ios:** add Swift only UIKit class initializers for Diez types ([#159](https://github.com/diez/diez/issues/159)) ([913c54f](https://github.com/diez/diez/commit/913c54f))
* **ios:** generate SDK as a collection of files instead of a single SDK.swift ([#163](https://github.com/diez/diez/issues/163)) ([c625e08](https://github.com/diez/diez/commit/c625e08))
* add "press r to reload" functionality for `diez extract --hot` ([#165](https://github.com/diez/diez/issues/165)) ([174b72d](https://github.com/diez/diez/commit/174b72d))
* **site:** add Figma guide ([#153](https://github.com/diez/diez/issues/153)) ([de1ebc8](https://github.com/diez/diez/commit/de1ebc8))
* **site:** add global component to define tabbed code examples ([#156](https://github.com/diez/diez/issues/156)) ([d278c87](https://github.com/diez/diez/commit/d278c87))
* **targets:** add ability to compile CSS and SCSS ([#174](https://github.com/diez/diez/issues/174)) ([26ec8fe](https://github.com/diez/diez/commit/26ec8fe))
* **targets:** require `--js` param for web target ([#167](https://github.com/diez/diez/issues/167)) ([a4669ad](https://github.com/diez/diez/commit/a4669ad))
* **targets:** revamp Web JavaScript binding helpers ([#162](https://github.com/diez/diez/issues/162)) ([55dd138](https://github.com/diez/diez/commit/55dd138))


### BREAKING CHANGES

* **android:** Extensions on Android classes that were values with a setter and a null returning getter are now functions.





# [10.0.0-beta.0](https://github.com/diez/diez/compare/v10.0.0-alpha.0...v10.0.0-beta.0) (2019-06-14)


### Bug Fixes

* **analytics:** ensure Sentry events are actually sent. ([76d2ab5](https://github.com/diez/diez/commit/76d2ab5))
* **createproject:** ensure node_modules is ignored in .gitignore for new projects ([35ea863](https://github.com/diez/diez/commit/35ea863))
* **createproject:** simplify `lorem-ipsum` web example ([#120](https://github.com/diez/diez/issues/120)) ([085d1b0](https://github.com/diez/diez/commit/085d1b0))
* **docs:** allow docs to be generated when the repo is in a path with ‘src’ in it ([#106](https://github.com/diez/diez/issues/106)) ([0d2c3de](https://github.com/diez/diez/commit/0d2c3de))
* **docs:** typos + styling ([#75](https://github.com/diez/diez/issues/75)) ([7714a61](https://github.com/diez/diez/commit/7714a61))
* **examples:** fix LoadingView initialization in PoodleSurf ([#110](https://github.com/diez/diez/issues/110)) ([ddbcd04](https://github.com/diez/diez/commit/ddbcd04))
* **examples:** fix retina layout of lorem-ipsum web ([#143](https://github.com/diez/diez/issues/143)) ([c000b67](https://github.com/diez/diez/commit/c000b67))
* ensure symlinks work for linking the example project ([a3b801c](https://github.com/diez/diez/commit/a3b801c))
* **generation:** increased compatibility and robustness for font location ([#144](https://github.com/diez/diez/issues/144)) ([2f5ee83](https://github.com/diez/diez/commit/2f5ee83))
* **ios:** fix incorrect output framework filename in carthage build phase ([#103](https://github.com/diez/diez/issues/103)) ([292546f](https://github.com/diez/diez/commit/292546f))
* **ios:** make component properties public internal(set) ([#83](https://github.com/diez/diez/issues/83)) ([4119665](https://github.com/diez/diez/commit/4119665))
* install node-fetch as a non-dev dependency of @diez/storage ([f64a365](https://github.com/diez/diez/commit/f64a365))
* run CLI update check in the main thread ([#141](https://github.com/diez/diez/issues/141)) ([739d4f3](https://github.com/diez/diez/commit/739d4f3))
* use normal slashes when resolving node_modules sources ([#77](https://github.com/diez/diez/issues/77)) ([dbe02e1](https://github.com/diez/diez/commit/dbe02e1))
* **ios:** save component state after an update ([#139](https://github.com/diez/diez/issues/139)) ([9f188fc](https://github.com/diez/diez/commit/9f188fc))
* **site:** use nuxt built-in loading bar to load docs ([#89](https://github.com/diez/diez/issues/89)) ([f45e549](https://github.com/diez/diez/commit/f45e549))
* **ios:** rename `UIImage` getter on `Image` to `uiImage` ([#137](https://github.com/diez/diez/issues/137)) ([7bbd9f5](https://github.com/diez/diez/commit/7bbd9f5))


### Features

* **analytics:** add Sentry crash reporting for private beta ([#152](https://github.com/diez/diez/issues/152)) ([a47a9de](https://github.com/diez/diez/commit/a47a9de))
* **cli:** add opt-out analytics to `diez` ([#92](https://github.com/diez/diez/issues/92)) ([08291ec](https://github.com/diez/diez/commit/08291ec))
* **cli:** allow default command options to be specified in .diezrc ([#84](https://github.com/diez/diez/issues/84)) ([0e8a1bb](https://github.com/diez/diez/commit/0e8a1bb))
* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/diez/diez/issues/97)) ([4b57a8e](https://github.com/diez/diez/commit/4b57a8e))
* **compiler:** implement canUseNpm ([#85](https://github.com/diez/diez/issues/85)) ([e516caa](https://github.com/diez/diez/commit/e516caa))
* **createproject:** `yarn create`/`npm init` starter kits for Diez ([#130](https://github.com/diez/diez/issues/130)) ([86caab2](https://github.com/diez/diez/commit/86caab2))
* **createproject:** add simple start-* scripts for `diez create` example projects ([#147](https://github.com/diez/diez/issues/147)) ([5711743](https://github.com/diez/diez/commit/5711743))
* **createproject:** shore up the behavior of `diez create` ([#126](https://github.com/diez/diez/issues/126)) ([17d0202](https://github.com/diez/diez/commit/17d0202))
* **docs:** add getting started docs for iOS ([#132](https://github.com/diez/diez/issues/132)) ([f67f039](https://github.com/diez/diez/commit/f67f039))
* **docs:** add getting started guides for web ([#138](https://github.com/diez/diez/issues/138)) ([2972e8c](https://github.com/diez/diez/commit/2972e8c))
* **examples:** add android example to lorem-ipsum ([#113](https://github.com/diez/diez/issues/113)) ([12797c8](https://github.com/diez/diez/commit/12797c8))
* **examples:** add web example to lorem-ipsum ([#114](https://github.com/diez/diez/issues/114)) ([eee18f8](https://github.com/diez/diez/commit/eee18f8))
* **examples:** use custom .ttf fonts in poodle-surf ([#96](https://github.com/diez/diez/issues/96)) ([e731c33](https://github.com/diez/diez/commit/e731c33))
* **examples:** use hot updates in lorem-ipsum android example ([#136](https://github.com/diez/diez/issues/136)) ([8cabfc4](https://github.com/diez/diez/commit/8cabfc4))
* **ios:** generate asset catalog for images ([#87](https://github.com/diez/diez/issues/87)) ([806a331](https://github.com/diez/diez/commit/806a331))
* **ios:** remove Updatable ([#134](https://github.com/diez/diez/issues/134)) ([cff9845](https://github.com/diez/diez/commit/cff9845))
* **ios:** throw and error when NSAllowsLocalNetworking is not set to true ([#90](https://github.com/diez/diez/issues/90)) ([7692103](https://github.com/diez/diez/commit/7692103))
* **ios:** use Result type for attachment subscriptions on iOS ([#79](https://github.com/diez/diez/issues/79)) ([3e6ee84](https://github.com/diez/diez/commit/3e6ee84))
* **services:** move Figma OAuth handshake broker into the monorepo and migrate to the serverless stack ([#94](https://github.com/diez/diez/issues/94)) ([6f050b7](https://github.com/diez/diez/commit/6f050b7))
* **site:** add a 'the basics' guide ([#142](https://github.com/diez/diez/issues/142)) ([4b1a590](https://github.com/diez/diez/commit/4b1a590))
* **site:** add analytics explainer page ([#93](https://github.com/diez/diez/issues/93)) ([7f587a4](https://github.com/diez/diez/commit/7f587a4))
* **targets:** add Carthage support to iOS ([#67](https://github.com/diez/diez/issues/67)) ([31ed20f](https://github.com/diez/diez/commit/31ed20f))
* **targets:** Lottie & Animator config options ([#66](https://github.com/diez/diez/issues/66)) ([c7328e3](https://github.com/diez/diez/commit/c7328e3))
* add script that generates example templates for createproject ([#115](https://github.com/diez/diez/issues/115)) ([943513c](https://github.com/diez/diez/commit/943513c))
* add support for design system extraction for Figma files ([#140](https://github.com/diez/diez/issues/140)) ([26b6d87](https://github.com/diez/diez/commit/26b6d87))
* finalize early access guides ([#149](https://github.com/diez/diez/issues/149)) ([f9dc8a6](https://github.com/diez/diez/commit/f9dc8a6))


### Performance Improvements

* **cli:** reduce the dependency weight of the `diez` CLI ([#86](https://github.com/diez/diez/issues/86)) ([94dbee0](https://github.com/diez/diez/commit/94dbee0))
* examples/site performance enchancements ([#91](https://github.com/diez/diez/issues/91)) ([e6285db](https://github.com/diez/diez/commit/e6285db))
* **site:** actually show the fallback font if the loading fails ([#95](https://github.com/diez/diez/issues/95)) ([2aa8084](https://github.com/diez/diez/commit/2aa8084))


### BREAKING CHANGES

* **ios:** The `image` property getter that returns a `UIImage` on the `Image` extension has been renamed `uiImage`.
* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.
