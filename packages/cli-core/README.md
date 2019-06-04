# `@diez/cli-core`

This package provides the core functionality of the extensible Diez command line interface.

Diez configurations, which can be specified either in `package.json` using the special `"diez"` key or in a dedicated `.diezrc` file, can extend the command line functionality in various ways, including registering compiler targets and providing entire new commands.

A `CliCommandProvider` can be implemented in a Diez package like this:

```
// src/commands/command.ts
import {CliCommandProvider} from '@diez/cli-core';

const provider: CliCommandProvider = {
  loadAction: () => action,
  name: 'command',
  description: 'Command description',
  options: [
    {
      shortName: 'o',
      longName: 'option',
      valueName: 'optionValue',
      description: 'Some option.',
    },
  ],
};

export = provider;
```

A custom command provider can be registered in `package-name/package.json`:

```
{
  "name": "package-name",
  ...,
  "diez": {
    "providers": {
      "commands": ["./lib/commands/command"]
    }
  }
}
```

or in `package-name/.diezrc`:

```
{
  "providers": {
    "commands": ["./lib/commands/command"]
  }
}
```

The resulting command can be invoked with: `diez command --option [-o] <optionValue>`.
