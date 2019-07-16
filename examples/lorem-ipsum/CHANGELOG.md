# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-beta.2](https://github.com/stristr/diez/compare/v10.0.0-beta.1...v10.0.0-beta.2) (2019-07-16)


### Features

* add a new package featuring a webpack plugin to integrate Diez with web ([#193](https://github.com/stristr/diez/issues/193)) ([6bd7932](https://github.com/stristr/diez/commit/6bd7932))
* **examples:** use palette to map raw colors names that describe their usage ([#202](https://github.com/stristr/diez/issues/202)) ([ed91430](https://github.com/stristr/diez/commit/ed91430))
* **prefabs:** add angle static constructor to LinearGradient ([#200](https://github.com/stristr/diez/issues/200)) ([ad69f6e](https://github.com/stristr/diez/commit/ad69f6e))
* **prefabs:** add linear gradient prefab ([#191](https://github.com/stristr/diez/issues/191)) ([d01700a](https://github.com/stristr/diez/commit/d01700a))
* **site:** create and integrate a Diez project for website styles ([#182](https://github.com/stristr/diez/issues/182)) ([651fe90](https://github.com/stristr/diez/commit/651fe90))





# [10.0.0-beta.1](https://github.com/diez/diez/compare/v10.0.0-beta.0...v10.0.0-beta.1) (2019-07-02)


### Bug Fixes

* **android:** ensure hot mode webview does not cover content ([#170](https://github.com/diez/diez/issues/170)) ([d0164c9](https://github.com/diez/diez/commit/d0164c9))


### Code Refactoring

* **android:** improve android SDK semantics ([#160](https://github.com/diez/diez/issues/160)) ([1b1d1a6](https://github.com/diez/diez/commit/1b1d1a6))


### Features

* **compiler:** add the ability to set generated SDK versions with a command line flag ([#158](https://github.com/diez/diez/issues/158)) ([bdb6c9e](https://github.com/diez/diez/commit/bdb6c9e))
* **createproject:** add comments in example projects that lead a viewer back to the TypeScript definitions ([#176](https://github.com/diez/diez/issues/176)) ([3ed19c1](https://github.com/diez/diez/commit/3ed19c1))
* **createproject:** make example project easier to follow ([#178](https://github.com/diez/diez/issues/178)) ([19fa10f](https://github.com/diez/diez/commit/19fa10f))
* **targets:** require `--js` param for web target ([#167](https://github.com/diez/diez/issues/167)) ([a4669ad](https://github.com/diez/diez/commit/a4669ad))
* **targets:** revamp Web JavaScript binding helpers ([#162](https://github.com/diez/diez/issues/162)) ([55dd138](https://github.com/diez/diez/commit/55dd138))


### BREAKING CHANGES

* **android:** Extensions on Android classes that were values with a setter and a null returning getter are now functions.





# [10.0.0-beta.0](https://github.com/diez/diez/compare/v10.0.0-alpha.0...v10.0.0-beta.0) (2019-06-14)


### Bug Fixes

* **createproject:** simplify `lorem-ipsum` web example ([#120](https://github.com/diez/diez/issues/120)) ([085d1b0](https://github.com/diez/diez/commit/085d1b0))
* ensure symlinks work for linking the example project ([a3b801c](https://github.com/diez/diez/commit/a3b801c))
* **examples:** fix retina layout of lorem-ipsum web ([#143](https://github.com/diez/diez/issues/143)) ([c000b67](https://github.com/diez/diez/commit/c000b67))
* **ios:** rename `UIImage` getter on `Image` to `uiImage` ([#137](https://github.com/diez/diez/issues/137)) ([7bbd9f5](https://github.com/diez/diez/commit/7bbd9f5))


### Features

* **compiler:** enable fully ejectable Diez SDKs for Android and web ([#97](https://github.com/diez/diez/issues/97)) ([4b57a8e](https://github.com/diez/diez/commit/4b57a8e))
* add script that generates example templates for createproject ([#115](https://github.com/diez/diez/issues/115)) ([943513c](https://github.com/diez/diez/commit/943513c))
* **createproject:** add simple start-* scripts for `diez create` example projects ([#147](https://github.com/diez/diez/issues/147)) ([5711743](https://github.com/diez/diez/commit/5711743))
* **createproject:** shore up the behavior of `diez create` ([#126](https://github.com/diez/diez/issues/126)) ([17d0202](https://github.com/diez/diez/commit/17d0202))
* **docs:** add getting started docs for iOS ([#132](https://github.com/diez/diez/issues/132)) ([f67f039](https://github.com/diez/diez/commit/f67f039))
* **examples:** add android example to lorem-ipsum ([#113](https://github.com/diez/diez/issues/113)) ([12797c8](https://github.com/diez/diez/commit/12797c8))
* **examples:** add web example to lorem-ipsum ([#114](https://github.com/diez/diez/issues/114)) ([eee18f8](https://github.com/diez/diez/commit/eee18f8))
* **examples:** use hot updates in lorem-ipsum android example ([#136](https://github.com/diez/diez/issues/136)) ([8cabfc4](https://github.com/diez/diez/commit/8cabfc4))


### Performance Improvements

* **cli:** reduce the dependency weight of the `diez` CLI ([#86](https://github.com/diez/diez/issues/86)) ([94dbee0](https://github.com/diez/diez/commit/94dbee0))


### BREAKING CHANGES

* **ios:** The `image` property getter that returns a `UIImage` on the `Image` extension has been renamed `uiImage`.
* **compiler:** the `diez compile` command no longer uses an `--outputPath/-o` flag for directing SDK output to a specified directory nor a `--devMode/-d` flag for running "hot", and instead builds SDKs into `build/` in unique directories per project/target like `build/diez-poodle-surf-ios`.
