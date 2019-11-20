# `@diez/compiler-core`

This package provides base classes which can be used to build compilers from Diez projects into any target language, framework, or platform. A dependency on `@diez/compiler-core` registers the CLI command `diez compile --target <target-name>`, which compiles a Diez project for a given compiler target (e.g. `android`, `ios`, or `web`) into the `build` directory.

Compilation is typically executed in two phases.

### Phase 1: Parsing

The compiler core itself has very few requirements; it can be executed against any TypeScript project with this approximate shape:

```
project-root
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

Running `yarn create diez` sets up a project with this structure for you.

At compile time, the `diez compile` command first parses the TypeScript AST of every component exported from `src/index.ts`, then recursively parses its component properties. For example, given these contents:

```
import {Color} from '@diez/prefabs';

class Palette {
  red = Color.rgb(255, 0, 0);
}

export class DesignLanguage {
  palette = new Palette();
}
```

the parser will build a typed, abstract tree based on the exported component `DesignLanguage`. Because `Color` and `Palette` are recursive dependencies of `DesignLanguage`, they will also be processed. The resulting abstract tree is the main input to the next compilation phase.

### Phase 2: Compilation

The compilation phase generates native source code for the requested target platform. This process typically involves generating design token component classes from code templates, assembling additional functionality and features from [native bindings](https://diez.org/glossary/#bindings), transcribing file assets and other dependencies, and ultimately writing build artifacts out to disk.

For convenience, the compiler core includes an [abstract compiler class](https://diez.org/docs/latest/classes/compiler_compiler_core.compiler.html). Although this class may provide useful time-saving abstractions, there is no requirement to use it when building support for a new Diez compiler target.
