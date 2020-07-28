// Only used as a type.
// tslint:disable-next-line: no-implicit-dependencies
import {MediaQueriesData} from '@diez/prefabs';

/**
 * Returns a string with a valid css media query.
 */
export const queriesToCss = ({queries}: MediaQueriesData) => queries.map((query) => {
  const mediaQueries = [];

  if (query.operator && query.type) {
    mediaQueries.push(`${query.operator} ${query.type}`);
  } else if (query.type) {
    mediaQueries.push(query.type);
  }

  if (typeof query.minWidth !== 'undefined') {
    mediaQueries.push(`(min-width: ${query.minWidth}px)`);
  }

  if (typeof query.maxWidth !== 'undefined') {
    mediaQueries.push(`(max-width: ${query.maxWidth}px)`);
  }

  if (typeof query.minHeight !== 'undefined') {
    mediaQueries.push(`(min-height: ${query.minHeight}px)`);
  }

  if (typeof query.maxHeight !== 'undefined') {
    mediaQueries.push(`(max-height: ${query.maxHeight}px)`);
  }

  if (typeof query.minAspectRatio !== 'undefined') {
    mediaQueries.push(`(min-aspect-ratio: ${query.minAspectRatio})`);
  }

  if (typeof query.maxAspectRatio !== 'undefined') {
    mediaQueries.push(`(max-aspect-ratio: ${query.maxAspectRatio})`);
  }

  if (typeof query.minResolution !== 'undefined') {
    mediaQueries.push(`(min-resolution: ${query.minResolution}dpi)`);
  }

  if (typeof query.maxResolution !== 'undefined') {
    mediaQueries.push(`(max-resolution: ${query.maxResolution}dpi)`);
  }

  if (typeof query.orientation !== 'undefined') {
    mediaQueries.push(`(orientation: ${query.orientation})`);
  }

  if (typeof query.displayMode !== 'undefined') {
    mediaQueries.push(`(display-mode: ${query.displayMode})`);
  }

  if (typeof query.prefersColorScheme !== 'undefined') {
    mediaQueries.push(`(prefers-color-scheme: ${query.prefersColorScheme})`);
  }

  if (typeof query.prefersReducedMotion !== 'undefined') {
    mediaQueries.push(`(prefers-reduced-motion: ${query.prefersReducedMotion})`);
  }

  return mediaQueries.join(' and ');
}).join(', ');
