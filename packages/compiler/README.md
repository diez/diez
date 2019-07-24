# `@diez/compiler`

This package provides base classes which can be used to build compilers from Diez components into any target language, framework, or platform. A dependency on `@diez/compile` registers the CLI command `diez compile --target <target-name>`, which compiles components exported by such a package for a given compiler target (e.g. `ios`, `android`, or `web`) into the `build` directory.

The compiler itself has very few requirements; it is expecting to be run against a TypeScript project of this approximate shape:

```
project-root
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

Additionally, the compiler expects the TypeScript configuration is set up to compile from `src/` to `lib/`, and that the main file of the module is located at `lib/index.js` after compilation. This constraint may be loosened in the future, but for now, `diez create` sets up a project with this structure for you.

At compile time, the compiler first parses the TypeScript AST of every component exported in `src/index.ts`, and recursively parses its component properties. For example, given these contents:

```
import {Color} from '@diez/prefabs';

class Palette {
  red = Color.rgb(255, 0, 0);
}

export class DesignSystem {
  palette = new Palette();
}
```

the compiler will build a typed, abstract tree based on the exported component `DesignSystem`. Because `Color` and `Palette` are recursive dependencies of `DesignSystem`, they will also be processed. The resulting abstract tree will be emitted to the target compiler implementation to produce source code for the target platform, allowing you to to attach to a `DesignSystem` in a host code base.

For some examples of target compilers which can be built using `@diez/compiler` as a foundation, refer to [`@diez/targets`](https://github.com/diez/diez/tree/master/packages/targets).
