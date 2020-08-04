// Only used as a type.
// tslint:disable-next-line: no-implicit-dependencies
import {MediaQueryData} from '@diez/prefabs';

/**
 * Returns a string with a valid css media query.
 */
export const queryToCss = (query: MediaQueryData) => {
  const mediaQueries = [];

  if (query.operator !== 'none' && query.type !== 'none') {
    mediaQueries.push(`${query.operator} ${query.type}`);
  } else if (query.type !== 'none') {
    mediaQueries.push(query.type);
  }

  if (query.minWidth > -1) {
    mediaQueries.push(`(min-width: ${query.minWidth}px)`);
  }

  if (query.maxWidth > -1) {
    mediaQueries.push(`(max-width: ${query.maxWidth}px)`);
  }

  if (query.minHeight > -1) {
    mediaQueries.push(`(min-height: ${query.minHeight}px)`);
  }

  if (query.maxHeight > -1) {
    mediaQueries.push(`(max-height: ${query.maxHeight}px)`);
  }

  if (query.minAspectRatio.every((num) => num > -1)) {
    mediaQueries.push(`(min-aspect-ratio: ${query.minAspectRatio.slice(0, 2).join('/')})`);
  }

  if (query.maxAspectRatio.every((num) => num > -1)) {
    mediaQueries.push(`(max-aspect-ratio: ${query.maxAspectRatio.slice(0, 2).join('/')})`);
  }

  if (query.minResolution > -1) {
    mediaQueries.push(`(min-resolution: ${query.minResolution}dpi)`);
  }

  if (query.maxResolution > -1) {
    mediaQueries.push(`(max-resolution: ${query.maxResolution}dpi)`);
  }

  if (query.orientation !== 'none') {
    mediaQueries.push(`(orientation: ${query.orientation})`);
  }

  if (query.displayMode !== 'none') {
    mediaQueries.push(`(display-mode: ${query.displayMode})`);
  }

  if (query.prefersColorScheme !== 'none') {
    mediaQueries.push(`(prefers-color-scheme: ${query.prefersColorScheme})`);
  }

  if (query.prefersReducedMotion !== 'none') {
    mediaQueries.push(`(prefers-reduced-motion: ${query.prefersReducedMotion})`);
  }

  return mediaQueries.join(' and ');
};
