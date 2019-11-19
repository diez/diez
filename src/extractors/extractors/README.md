# `@diez/extractors`

This package provides extractor implementations for Sketch, Figma, and Adobe XD based on the core capabilities of `@diez/extractors-core`.

The supported extraction sources based on web services can be registered in `.diezrc` like so:

```json
{
  "designs": {
    "services": [
      "https://www.figma.com/file/...",
      ...
    ]
  }
}
```

Currently, Sketch and Adobe XD extraction is supported via design files located in `./designs/`.
