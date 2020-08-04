import {prefab, Target} from '@diez/engine';

/**
 * Valid CSS logical operators.
 */
export const enum QueryOperator {
  Not = 'not',
  Only = 'only',
  None = 'none',
}

/**
 * Valid media type selectors.
 */
export const enum QueryType {
  All = 'all',
  Print = 'print',
  Screen = 'screen',
  Speech = 'speech',
  None = 'none',
}

/**
 * Valid device orientation types.
 */
export const enum Orientation {
  Landscape = 'landscape',
  Portrait = 'portrait',
  None = 'none',
}

/**
 * Valid color scheme types.
 */
export const enum ColorScheme {
  Light = 'light',
  Dark = 'dark',
  None = 'none',
}

/**
 * Valid reduced motion types.
 */
export const enum ReducedMotion {
  NoPreference = 'no-preference',
  Reduce = 'reduce',
  None = 'none',
}

/**
 * Valid display mode types.
 */
export const enum DisplayMode {
  Fullscreen = 'fullscreen',
  Standalone = 'standalone',
  MinimalUI = 'minimal-ui',
  Browser = 'browser',
  None = 'none',
}

/**
 * Individual media query data.
 */
export interface MediaQueryData {
  /**
   * A value of `-1` or `none` will be treated as if the value is not set.
   *
   * TODO: Use optionality instead when it is supported by the compiler.
   */
  operator: QueryOperator;
  type: QueryType;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  minAspectRatio: number[];
  maxAspectRatio: number[];
  minResolution: number;
  maxResolution: number;
  orientation: Orientation;
  displayMode: DisplayMode;
  prefersColorScheme: ColorScheme;
  prefersReducedMotion: ReducedMotion;
}

/**
 * Representation of a media query.
 * @noinheritdoc
 */
export class MediaQuery extends prefab<MediaQueryData>() {
  defaults = {
    operator: QueryOperator.None,
    type: QueryType.Screen,
    minWidth: -1,
    maxWidth: -1,
    minHeight: -1,
    maxHeight: -1,
    minAspectRatio: [-1, -1],
    maxAspectRatio: [-1, -1],
    minResolution: -1,
    maxResolution: -1,
    orientation: Orientation.None,
    displayMode: DisplayMode.None,
    prefersColorScheme: ColorScheme.None,
    prefersReducedMotion: ReducedMotion.None,
  };

  constructor (overrides: Partial<MediaQueryData> = {}) {
    super(overrides);
    this.targets = [Target.Web];
  }
}
