# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-alpha.8](https://github.com/stristr/diez/compare/v10.0.0-alpha.0...v10.0.0-alpha.8) (2019-06-14)


### Bug Fixes

* **docs:** typos + styling ([#75](https://github.com/stristr/diez/issues/75)) ([7714a61](https://github.com/stristr/diez/commit/7714a61))
* **site:** use nuxt built-in loading bar to load docs ([#89](https://github.com/stristr/diez/issues/89)) ([f45e549](https://github.com/stristr/diez/commit/f45e549))


### Features

* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/stristr/diez/issues/97)) ([4b57a8e](https://github.com/stristr/diez/commit/4b57a8e))
* **createproject:** `yarn create`/`npm init` starter kits for Diez ([#130](https://github.com/stristr/diez/issues/130)) ([86caab2](https://github.com/stristr/diez/commit/86caab2))
* add support for design system extraction for Figma files ([#140](https://github.com/stristr/diez/issues/140)) ([26b6d87](https://github.com/stristr/diez/commit/26b6d87))
* **site:** add a 'the basics' guide ([#142](https://github.com/stristr/diez/issues/142)) ([4b1a590](https://github.com/stristr/diez/commit/4b1a590))
* **site:** add analytics explainer page ([#93](https://github.com/stristr/diez/issues/93)) ([7f587a4](https://github.com/stristr/diez/commit/7f587a4))
* finalize early access guides ([#149](https://github.com/stristr/diez/issues/149)) ([f9dc8a6](https://github.com/stristr/diez/commit/f9dc8a6))


### Performance Improvements

* **cli:** reduce the dependency weight of the `diez` CLI ([#86](https://github.com/stristr/diez/issues/86)) ([94dbee0](https://github.com/stristr/diez/commit/94dbee0))
* examples/site performance enchancements ([#91](https://github.com/stristr/diez/issues/91)) ([e6285db](https://github.com/stristr/diez/commit/e6285db))
* **site:** actually show the fallback font if the loading fails ([#95](https://github.com/stristr/diez/issues/95)) ([2aa8084](https://github.com/stristr/diez/commit/2aa8084))


### BREAKING CHANGES

* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.
