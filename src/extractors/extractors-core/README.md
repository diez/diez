# `@diez/extractors-core`

This package provides the core functionality of Diez design file extraction.

Extraction as a service is provided via the CLI command `diez extract` for any Diez project that depends on `@diez/extractors-core`.

This package only provides an API for defining extractors, but does not directly implement extractors itself. For extraction from design files hosted online, you can register services in `.diezrc` like so:

```json
{
  "designs": {
    "services": [
      "https://...",
      ...
    ]
  }
}
```

In addition to services you register, `diez extract` will automatically look for design files in `./designs/`. As a general pattern, in extractor implementations, supported assets should be extracted to `./assets/`, and source code should be generated into `./src/designs`.

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
