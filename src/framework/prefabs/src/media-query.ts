import {prefab} from '@diez/engine';

/**
 * Not / Only specifier.
 */
export const enum NotOnly {
  Not = 'not',
  Only = 'only',
}

/**
 * Valid media type selectors.
 */
export const enum MediaType {
  All = 'all',
  Print = 'print',
  Screen = 'screen',
  Speech = 'speech',
}

/**
 * Individual media query data.
 */
export interface MediaQueryData {
  notOnly?: NotOnly;
  type?: MediaType;
  minWidth?: number;
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
      type: MediaType.Screen,
      minWidth: 0,
    }],
  };

  static minWidth (width: number) {
    return new MediaQuery({queries: [{type: MediaType.Screen, minWidth: width}]});
  }
}
