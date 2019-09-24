# Diez compiler

The packages in this directory are concerned with native transpilation of TypeScript component definitions into pure native SDKs. Via the `diez compile --target <target-name>` subcommand provided by [`compiler-core`](./compiler-core/), the Diez compiler produces useful design system SDKs as build artifacts.

[`targets`](./targets/) provides canonical compilers for the platforms `android`, `ios`, and `web`. Using the compiler API, it is possible to define additional targets or modify the behavior of existing targets.
