# Diez command line interface

The packages in this directory provide an extensible, progammable `diez` command line interface (CLI). When invoked within a Diez project directory, the `diez` CLI traverses the project's dependency graph to locate and register packages extending the functionality of Diez.

Here are a few ways packages can extend the functionality of Diez:
 - provide additional subcommands to the `diez` CLI, such as `diez compile` (see [`compiler-core`](../compiler/compiler-core/)) and `diez extract` (see [`extractors-core`](../extractors/extractors-core/))
 - register compiler targets for the `diez compile` subcommand, such as `android`, `ios`, and `web` (see [`targets`](../compiler/targets/))
 - support extraction from design file sources like Sketch, Figma, and Adobe XD using the `diez extract` subcommand (see [`extractors`](../extractors/extractors/))