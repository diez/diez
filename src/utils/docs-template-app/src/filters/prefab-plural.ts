const plurals: {[key: string]: string} = {
  Lottie: 'Lottie Files',
  Size2D: 'Sizes',
  Typograph: 'Typography',
  LinearGradient: 'Linear Gradients',
  Point2D: 'Points',
  DropShadow: 'Drop Shadows',
};

/**
 * Pluralize prefab names
 */
export const prefabPlural = (value: string) => {
  return plurals[value] || `${value}s`;
};
