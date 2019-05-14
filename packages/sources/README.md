# `@diez/sources`

This package provides utilities and metaprogramming extensions for design sources. Its current capabilities include:
 - Extracting design systems from files with support for Sketch and Illustrator.
 - Extracting designs systems from services including Figma and InVision Design System Manager.

Extraction as a service is provided via the CLI command `diez extract` for any Diez project that depends on `@diez/sources`. Services can be registered in `.diezrc` like so:

```
{
  "designs": {
    "services": [
      "https://projects.invisionapp.com/dsm-export/…",
      "https://www.figma.com/file/…",
      ...
    ]
  }
}
```

In addition to services you register, `diez extract` will automatically look for design files (Sketch and Illustrator) in `./designs/`. Assets will be extracted to `./assets/`, and source code will be generated in `./src/designs`.

If desired, these directories can be customized using `.diezrc`:

```
{
  "designs": {
    "sources": "./my-designs",
    "assets": "./my-assets",
    "code": "./src/my-designs",
    "services": […]
  }
}
```
