# Diez extractors

The packages in this directory provide utilities, metaprogramming extensions, and functionality for extracting design tokens from design file sources into code. Via the `diez extract` subcommand provided by [`extractors-core`](./extractors-core/), Diez generates normalized, strongly typed source code for any machine readable design file.

The [`extractors`](./extractors/) package provides canonical design file support for Sketch, Figma, and Adobe XD. Using the extractors API, it is straightforward to build support for additional types of design file sources.

*A note regarding the Adobe XD extractor:*
The Adobe XD extractor works by statically parsing XD files.  It does not use Adobe XD's plugin- or developer APIs.  This means that the Diez XD extractor can be run stand-alone, without needing to install or run Adobe XD.  While this affords great flexibility, portability, and developer ergonomics, it has one notable drawback.
The Adobe XD file format may change without notice, which would break the extractor's functionality until updated to match any new format.  As of this writing, the Diez Adobe XD extraction logic has worked for nearly a year without XD introducing any breaking changes — but it could happen in the future.  If XD does introduce breaking changes to their file format, the solution will be to create a new version of the Diez extraction logic, and to introspect XD file versions when parsing.  The team maintaining Diez has decided to cross the bridge if we come to it — but we haven't had to yet.
