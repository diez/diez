# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-beta.4](https://github.com/diez/diez/compare/v10.0.0-beta.3...v10.0.0-beta.4) (2019-08-09)


### Bug Fixes

* **site:** fix typos on Sketch guide ([#239](https://github.com/diez/diez/issues/239)) ([72422ac](https://github.com/diez/diez/commit/72422ac))


### chore

* **targets:** clean up JS SDK helpers  ([#227](https://github.com/diez/diez/issues/227)) ([f2baade](https://github.com/diez/diez/commit/f2baade))


### BREAKING CHANGES

* **targets:** the JavaScript SDK no longer provides the `urlCss` method for `File` and `Image` prefabs.





# [10.0.0-beta.3](https://github.com/diez/diez/compare/v10.0.0-beta.2...v10.0.0-beta.3) (2019-07-30)


### Features

* **compiler:** add support for plain TypeScript classes without decorators ([#215](https://github.com/diez/diez/issues/215)) ([59960c9](https://github.com/diez/diez/commit/59960c9))
* **site:** improve <CodeTabs> to select all tabs of the same language ([#217](https://github.com/diez/diez/issues/217)) ([3b81af6](https://github.com/diez/diez/commit/3b81af6))
* **targets:** update lottie-ios to 3.1.1 ([#203](https://github.com/diez/diez/issues/203)) ([119b85e](https://github.com/diez/diez/commit/119b85e))





# [10.0.0-beta.2](https://github.com/diez/diez/compare/v10.0.0-beta.1...v10.0.0-beta.2) (2019-07-16)


### Features

* add a new package featuring a webpack plugin to integrate Diez with web ([#193](https://github.com/diez/diez/issues/193)) ([6bd7932](https://github.com/diez/diez/commit/6bd7932))
* **prefabs:** add linear gradient prefab ([#191](https://github.com/diez/diez/issues/191)) ([d01700a](https://github.com/diez/diez/commit/d01700a))
* **site:** create and integrate a Diez project for website styles ([#182](https://github.com/diez/diez/issues/182)) ([651fe90](https://github.com/diez/diez/commit/651fe90))
* **targets:** add NSAttributedString helpers for Typograph on iOS. ([#201](https://github.com/diez/diez/issues/201)) ([af93c42](https://github.com/diez/diez/commit/af93c42))





# [10.0.0-beta.1](https://github.com/diez/diez/compare/v10.0.0-beta.0...v10.0.0-beta.1) (2019-07-02)


### Bug Fixes

* **site:** add GA tracking ([#155](https://github.com/diez/diez/issues/155)) ([4de3f71](https://github.com/diez/diez/commit/4de3f71))
* **site:** scope layout styles so docs do not receive extra styles ([#157](https://github.com/diez/diez/issues/157)) ([5089c2d](https://github.com/diez/diez/commit/5089c2d))


### Features

* **ios:** add Swift only UIKit class initializers for Diez types ([#159](https://github.com/diez/diez/issues/159)) ([913c54f](https://github.com/diez/diez/commit/913c54f))
* **site:** add Figma guide ([#153](https://github.com/diez/diez/issues/153)) ([de1ebc8](https://github.com/diez/diez/commit/de1ebc8))
* **site:** add global component to define tabbed code examples ([#156](https://github.com/diez/diez/issues/156)) ([d278c87](https://github.com/diez/diez/commit/d278c87))
* **targets:** require `--js` param for web target ([#167](https://github.com/diez/diez/issues/167)) ([a4669ad](https://github.com/diez/diez/commit/a4669ad))
* **targets:** revamp Web JavaScript binding helpers ([#162](https://github.com/diez/diez/issues/162)) ([55dd138](https://github.com/diez/diez/commit/55dd138))





# [10.0.0-beta.0](https://github.com/diez/diez/compare/v10.0.0-alpha.0...v10.0.0-beta.0) (2019-06-14)


### Bug Fixes

* **docs:** typos + styling ([#75](https://github.com/diez/diez/issues/75)) ([7714a61](https://github.com/diez/diez/commit/7714a61))
* **site:** use nuxt built-in loading bar to load docs ([#89](https://github.com/diez/diez/issues/89)) ([f45e549](https://github.com/diez/diez/commit/f45e549))


### Features

* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/diez/diez/issues/97)) ([4b57a8e](https://github.com/diez/diez/commit/4b57a8e))
* **createproject:** `yarn create`/`npm init` starter kits for Diez ([#130](https://github.com/diez/diez/issues/130)) ([86caab2](https://github.com/diez/diez/commit/86caab2))
* add support for design system extraction for Figma files ([#140](https://github.com/diez/diez/issues/140)) ([26b6d87](https://github.com/diez/diez/commit/26b6d87))
* **site:** add a 'the basics' guide ([#142](https://github.com/diez/diez/issues/142)) ([4b1a590](https://github.com/diez/diez/commit/4b1a590))
* **site:** add analytics explainer page ([#93](https://github.com/diez/diez/issues/93)) ([7f587a4](https://github.com/diez/diez/commit/7f587a4))
* finalize early access guides ([#149](https://github.com/diez/diez/issues/149)) ([f9dc8a6](https://github.com/diez/diez/commit/f9dc8a6))


### Performance Improvements

* **cli:** reduce the dependency weight of the `diez` CLI ([#86](https://github.com/diez/diez/issues/86)) ([94dbee0](https://github.com/diez/diez/commit/94dbee0))
* examples/site performance enchancements ([#91](https://github.com/diez/diez/issues/91)) ([e6285db](https://github.com/diez/diez/commit/e6285db))
* **site:** actually show the fallback font if the loading fails ([#95](https://github.com/diez/diez/issues/95)) ([2aa8084](https://github.com/diez/diez/commit/2aa8084))


### BREAKING CHANGES

* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.
