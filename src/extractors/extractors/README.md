# `@diez/extractors`

This package provides extractor implementations for Sketch, Figma, InVision Design System Manager and Adobe XD based on the core capabilities of `@diez/extractors-core`.

The supported extraction sources based on web services can be registered in `.diezrc` like so:

```json
{
  "designs": {
    "services": [
      "https://www.figma.com/file/...",
      "https://projects.invisionapp.com/dsm-export/...",
    ]
  }
}
```

Currently, Sketch and Adobe XD extraction is supported via design files located in `./designs/`.
