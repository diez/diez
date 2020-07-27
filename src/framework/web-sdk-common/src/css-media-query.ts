// Only used as a type.
// tslint:disable-next-line: no-implicit-dependencies
import {MediaQueriesData} from '@diez/prefabs';

/**
 * Returns a string with a valid css media query.
 */
export const queriesToCss = ({queries}: MediaQueriesData) => queries.map((query) => {
  const mediaQueries = [];
  if (query.type) {
    mediaQueries.push(query.type);
  }

  if (query.minWidth) {
    mediaQueries.push(`(min-width: ${query.minWidth}px)`);
  }

  console.log(mediaQueries);

  return mediaQueries.join(' and ');
}).join(', ');
