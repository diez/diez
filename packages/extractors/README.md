# `@diez/extractors`

This package provides extractor implementations for Sketch, Figma, and InVision Design System Manager based on the core capabilities of `@diez/extractors-core`.

The supported extraction sources based on web services can be registered in `.diezrc` like so:

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

Currently, Sketch extraction is supported via design files located in `./designs/`.
