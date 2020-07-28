import {prefab} from '@diez/engine';

/**
 * Valid CSS logical operators.
 */
export const enum QueryOperator {
  Not = 'not',
  Only = 'only',
}

/**
 * Valid media type selectors.
 */
export const enum QueryType {
  All = 'all',
  Print = 'print',
  Screen = 'screen',
  Speech = 'speech',
}

/**
 * Valid device orientation types.
 */
export const enum Orientation {
  Landscape = 'landscape',
  Portrait = 'portrait',
}

/**
 * Valid color scheme types.
 */
export const enum ColorScheme {
  Light = 'light',
  Dark = 'dark',
}

/**
 * Valid reduced motion types.
 */
export const enum ReducedMotion {
  NoPreference = 'no-preference',
  Reduce = 'reduce',
}

/**
 * Valid display mode types.
 */
export const enum DisplayMode {
  Fullscreen = 'fullscreen',
  Standalone = 'standalone',
  MinimalUI = 'minimal-ui',
  Browser = 'browser',
}

/**
 * Individual media query data.
 */
export interface MediaQueryData {
  operator?: QueryOperator;
  type?: QueryType;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  minAspectRatio?: number;
  maxAspectRatio?: number;
  minResolution?: number;
  maxResolution?: number;
  orientation?: Orientation;
  displayMode?: DisplayMode;
  prefersColorScheme?: ColorScheme;
  prefersReducedMotion?: ReducedMotion;
}

/**
 * Group of media queries.
 */
export interface MediaQueriesData {
  queries: MediaQueryData[];
}

/**
 * Representation of a media query.
 * @noinheritdoc
 */
export class MediaQuery extends prefab<MediaQueriesData>() {
  defaults = {
    queries: [{
      operator: QueryOperator.Only,
      type: QueryType.Screen,
    }],
  };

  static minWidth (min: number) {
    return new MediaQuery({queries: [{type: QueryType.Screen, minWidth: min}]});
  }

  static maxWidth (max: number) {
    return new MediaQuery({queries: [{type: QueryType.Screen, maxWidth: max}]});
  }

  static rangeWidth (min: number, max: number) {
    return new MediaQuery({queries: [{type: QueryType.Screen, minWidth: min, maxWidth: max}]});
  }

  static printOnly () {
    return new MediaQuery({queries: [{operator: QueryOperator.Only, type: QueryType.Print}]});
  }
}
