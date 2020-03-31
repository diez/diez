/**
 * Split a route path into an array of individual paths.
 */
export const pathToArray = (path: string) => {
  return path.split('/').filter(Boolean);
};

/**
 * Calculate the route path to a given path.
 */
export const pathToCrumb = (path: string, crumb: string) => {
  return path.substring(0, path.indexOf(crumb) + crumb.length);
};
