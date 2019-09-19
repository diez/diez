# `@diez/extractors`

This package provides utilities and metaprogramming extensions for extracting design tokens from design sources. Its current capabilities include:
 - Extracting design systems from files with support for Sketch.
 - Extracting designs systems from services including Figma and InVision Design System Manager.

Extraction as a service is provided via the CLI command `diez extract` for any Diez project that depends on `@diez/extractors`. Services can be registered in `.diezrc` like so:

```json
{
  "designs": {
    "services": [
      "https://projects.invisionapp.com/dsm-export/...",
      "https://www.figma.com/file/...",
      ...
    ]
  }
}
```

In addition to services you register, `diez extract` will automatically look for design files in `./designs/`. Supported assets will be extracted to `./assets/`, and source code will be generated in `./src/designs`.

If desired, these directories can be customized using `.diezrc`:

```json
{
  "designs": {
    "sources": "./my-designs",
    "assets": "./my-assets",
    "code": "./src/my-designs",
    "services": [...]
  }
}
```