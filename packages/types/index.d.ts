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
  export function valid(a: any): string | null;
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

declare module 'webpack-hot-middleware/client' {
  export function subscribeAll(handler: (payload: any) => void): void;
  export function subscribe(handler: (payload: any) => void): void;
}

declare module 'fontkit' {
  import {Stream} from 'stream';

  type FontkitCodePoint = number;
  type FontkitGlyph = {};

  interface FontkitSubset {
    includeGlyph(glyph: FontkitGlyph): void;
    encodeStream(): Stream;
  }

  interface FontkitFont {
    postscriptName: string;
    createSubset(): FontkitSubset;
    characterSet: Iterable<FontkitCodePoint>;
    glyphForCodePoint(codePoint: FontkitCodePoint): FontkitGlyph;
  }

  interface FontkitFontCollection {
    fonts: FontkitFont[];
    getFont (name: string): FontkitFont | null;
  }

  export function openSync(filename: string): FontkitFont | FontkitFontCollection | null;
}
