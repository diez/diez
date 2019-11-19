# Diez extractors

The packages in this directory provide utilities, metaprogramming extensions, and functionality for extracting design tokens from design file sources into code. Via the `diez extract` subcommand provided by [`extractors-core`](./extractors-core/), Diez generates normalized, strongly typed source code for any machine readable design file.

The [`extractors`](./extractors/) package provides canonical design file support for Sketch, Figma, and Adobe XD. Using the extractors API, it is straightforward to build support for additional types of design file sources.