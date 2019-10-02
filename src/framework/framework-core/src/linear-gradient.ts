/**
 * Gets the length of a CSS linear gradient line.
 *
 * @see {@link https://drafts.csswg.org/css-images-3/#funcdef-linear-gradient}
 */
export const cssLinearGradientLength = (angle: number) =>
  Math.abs(Math.sin(angle)) + Math.abs(Math.cos(angle));

/**
 * Generates a start and end point for a line from the provided angle, line length, and center position.
 *
 * @param angle: The angle of the line in radians where 0 is up and positive is clockwise.
 * @param lineLength: The length of the line.
 * @param center: The center position of the line.
 *
 * @returns The `start` and `end` points of a line in a coordinate space where positive x is to the right and positive
 *          y is downward.
 */
export const linearGradientStartAndEndPoints = (angle: number, lineLength: number, center: {x: number, y: number}) => {
  const differenceVector = {
    x: Math.sin(angle) * lineLength / 2,
    y: Math.cos(angle) * lineLength / 2,
  };
  const start = {
    x: center.x - differenceVector.x,
    y: 1 - (center.y - differenceVector.y),
  };
  const end = {
    x: center.x + differenceVector.x,
    y: 1 - (center.y + differenceVector.y),
  };
  return {start, end};
};
