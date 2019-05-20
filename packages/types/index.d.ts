declare module 'fs-walk' {
  import {Stats} from 'fs';

  function walkSync(
    path: string,
    callback: (basedir: string, filename: string, stats: Stats) => void,
  ): void;

  export {walkSync};
}

declare module 'semver' {
  export function gt(a: string, b: string): boolean;
  export function gte(a: string, b: string): boolean;
}

declare module 'typed-errors' {
  function makeTypedError(name: string): ErrorConstructor;

  export {makeTypedError};
}

declare module 'validate-npm-package-name' {
  interface Result {
    // Whether the package name is valid in the current npm registry.
    validForNewPackages: boolean;
    // Whether the package name would be valid in the legacy npm registry.
    validForOldPackages: boolean;
    // Any human-readable warnings associated with the package name.
    warnings: string[];
    // Any human-readable errors associated with the package name.
    errors: string[];
  }

  function validate(name: string): Result;

  export = validate;
}

declare module 'time-fix-plugin' {
  import {Plugin} from 'webpack';
  class TimeFixPlugin extends Plugin {}

  export = TimeFixPlugin;
}
