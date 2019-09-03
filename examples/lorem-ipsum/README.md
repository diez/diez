# lorem-ipsum

This project was created with [Diez](https://beta.diez.org).

## What's in the box

The `design-system` directory contains a Diez design system project. It is the living source of truth for your design system.

The `example-codebases` directory contains example projects connected to your Diez project. Note that the example apps are only present for demonstration purposes, and can be safely removed.

```
.
├── design-system
|   └── src
|       ├── index.ts
|       └── DesignSystem.ts
└── example-codebases
    ├── android
    ├── ios
    └── web
```

## Quickstart

To quickly experience how Diez works, simply run `yarn demo` from `design-system`. This command will use Diez to compile a JavaScript SDK for your design system and link it to the example web project located in `codebases/web`, then start the example web project in your browser.

Check out our [Getting Started guide](https://beta.diez.org/getting-started/) to learn more.
