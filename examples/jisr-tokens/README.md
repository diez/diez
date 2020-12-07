# lorem-ipsum

This project was created with [Diez](https://diez.org).

## What's in the box

The `design-language` directory contains a Diez design language project. It is the living source of truth for your design language.

The `example-codebases` directory contains example projects connected to your Diez project. Note that the example apps are only present for demonstration purposes, and can be safely removed.

```
.
├── design-language
|   └── src
|       ├── index.ts
|       └── DesignLanguage.ts
└── example-codebases
    ├── android
    ├── ios
    └── web
```

## Quickstart

To quickly experience how Diez works, simply run `yarn demo` or `npm run demo` from `design-language`. This command will use Diez to compile a JavaScript SDK for your design language and link it to the example web project located in `codebases/web`, then start the example web project in your browser.

Check out our [Getting Started guide](https://diez.org/getting-started/) to learn more.
