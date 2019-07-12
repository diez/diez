import {LinearGradientState, Point2DState} from '@diez/prefabs';

/**
 * @returns The hypotenuse of the provided point.
 */
const hypot = (point: Point2DState) => Math.sqrt(point.x * point.x + point.y * point.y);

/**
 * @returns A normalized copy of the provided point.
 */
const normalizePoint = (point: Point2DState) => {
  const length = hypot(point);
  return {
    x: point.x / length,
    y: point.y / length,
  };
};

/**
 * @returns A Point2D where `x = pointA.x + pointB.x` and `y = pointA.y + pointB.y`.
 */
const addPoints = (pointA: Point2DState, pointB: Point2DState) => {
  return {
    x: pointA.x + pointB.x,
    y: pointA.y + pointB.y,
  };
};

/**
 * @returns A Point2D where `x = pointA.x - pointB.x` and `y = pointA.y - pointB.y`.
 */
const subtractPoints = (pointA: Point2DState, pointB: Point2DState) => {
  return {
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y,
  };
};

/**
 * @returns The dot product of the two provided points.
 */
const dotProduct = (pointA: Point2DState, pointB: Point2DState) =>
  pointA.x * pointB.x + pointA.y * pointB.y;

/**
 * @returns The cross product of the two provided points.
 */
const crossProduct = (pointA: Point2DState, pointB: Point2DState) =>
  pointA.x * pointB.y - pointA.y * pointB.x;

/**
 * Gets the nearest coordinate of the provided point on an infinite line.
 *
 * @param linePoint A point that represents the start of the line.
 * @param lineVector A normalized vector representing the direction of the line.
 * @param point The point to compare with.
 */
const nearestPointOnLine = (linePoint: Point2DState, lineVector: Point2DState, point: Point2DState) => {
  const linePointToPoint = subtractPoints(point, linePoint);
  const t = dotProduct(linePointToPoint, lineVector);
  return {
    x: linePoint.x + lineVector.x * t,
    y: linePoint.y + lineVector.y * t,
  };
};

/**
 * Calculates the angle between the the provided points.
 *
 * ```
 * endA
 *   \
 *    \
 *     \__ result
 *      \_|________ endB
 *    start
 * ```
 */
const angleBetween = (start: Point2DState, endA: Point2DState, endB: Point2DState) => {
  const lineA = subtractPoints(start, endA);
  const lineB = subtractPoints(start, endB);

  const dot = dotProduct(lineA, lineB);
  const cross = crossProduct(lineA, lineB);

  return Math.atan2(cross, dot);
};

/**
 * Determines if the provided `point` is in the direction of the vector created from the `lineStart` to `lineEnd`.
 *
 * The following would produce true:
 * ```
 *     x------------x-------------x
 * lineStart      point         lineEnd
 * ```
 * ```
 *        point
 *          x
 *     x--------------------------x
 * lineStart                   lineEnd
 * ```
 *
 * The following would produce false:
 * ```
 *    x         x--------------------------x
 *  point    lineStart                  lineEnd
 * ```
 * ```
 *        x--------------------------x
 *     lineStart                   lineEnd
 *    x
 *  point
 * ```
 */
const isPointInDirection = (lineStart: Point2DState, lineEnd: Point2DState, point: Point2DState) => {
  const angle = angleBetween(lineStart, lineEnd, point);
  return Math.abs(angle) < Math.PI / 2;
};

/**
 * Gets the length of a CSS linear gradient line.
 *
 * See https://drafts.csswg.org/css-images-3/#funcdef-linear-gradient
 */
const cssLinearGradientLength = (angle: number) =>
  Math.abs(Math.sin(angle)) + Math.abs(Math.cos(angle));

/**
 * Converts from an angle where 0deg is right and a positive counter-clockwise, to an angle where 0deg is up and
 * positive is clockwise.
 */
const convertToCSSLinearGradientAngle = (angle: number) =>
  -angle + Math.PI / 2;

/**
 * Determines the linear gradient stop position for the provided point projected onto a CSS linear gradient line
 * corresponding to the provided angle.
 *
 *  ```
 *  (0, 1)_________________________(1, 1)
 *       |            |           /|
 *       |            |         /  |
 *       |            |(angle)/    |
 *       |            |_____/      |
 *       |            |   /        | The diagonal line represents a CSS linear gradient line of (pi/4)rad (45deg).
 *       |            | /          |
 *       | x (point)  x (0.5,0.5)  | The nearest point to the CSS gradient line is found based on the provided line.
 *       |   \      /              |
 *       |     \  /                |
 *       |      x                  |
 *       |    //                   | The result is the offset from the start of the CSS linear gradient line to the
 *       |  // <-- (result)        | projected point.
 *       |//_______________________|
 *  (0, 0)                         (1, 0)
 * ```
 *
 * @param angle The angle in radians for the CSS linear gradient that runs through (0.5, 0.5) where up is 0 and
 *              clockwise is the positive direction.
 * @param point The point in which to determine the stop percentage for in a coordinate space where +x is right and +y
 *              is up.
 *
 * @returns The corresponding stop position of the provided point where 1.0 is 100%. This value can be less than 0 or
 *          greater than 1.0.
 */
const stopPositionForPoint = (angle: number, point: Point2DState) => {
  const length = cssLinearGradientLength(angle);
  // The length of a CSS linear gradient line is `abs(width * sin(angle)) + abs(height * cos(angle))`. Since our width
  // and height are 1 we can omit them from the equation.
  // See https://drafts.csswg.org/css-images-3/#funcdef-linear-gradient
  const differenceVector = {
    x: Math.sin(angle) * length / 2,
    y: Math.cos(angle) * length / 2,
  };
  const center = {x: 0.5, y: 0.5};
  const start = subtractPoints(center, differenceVector);
  const end = addPoints(center, differenceVector);
  const direction = normalizePoint(differenceVector);

  const projectedPoint = nearestPointOnLine(center, direction, point);

  const offsetVector = subtractPoints(start, projectedPoint);
  let offsetDistance = hypot(offsetVector);
  const isPointInFront = isPointInDirection(start, end, projectedPoint);
  if (!isPointInFront) {
    offsetDistance *= -1;
  }
  return offsetDistance / length;
};

/**
 * Converts the provided point from a coordinate space where (0, 0) is top left and (1, 1) is bottom right, to a space
 * where (0, 0) is bottom left and (1, 1) is top right.
 */
const convertPoint = (point: Point2DState) => {
  return {
    x: point.x,
    y: 1 - point.y,
  };
};

/**
 * Returns a string with a valid CSS <linear-gradient> value from a LinearGradient prefab instance.
 *
 * See https://drafts.csswg.org/css-images-3/#funcdef-linear-gradient
 */
export const linearGradientToCss = (gradient: LinearGradientState) => {
  if (gradient.stops.length === 0) {
    return 'linear-gradient(none)';
  }

  // LinearGradient's properties use a coordinate space where (0, 0) is top left and (1, 1) is bottom right.
  // Convert our coordinates into a space where (0, 0) is bottom left and (1, 1) is top right to make our angle math
  // easier.
  const start = convertPoint(gradient.start);
  const end = convertPoint(gradient.end);

  const difference = subtractPoints(end, start);

  const angle = Math.atan2(difference.y, difference.x);
  const cssGradientAngle = convertToCSSLinearGradientAngle(angle);
  const cssGradientLength = cssLinearGradientLength(angle);

  const stopPositionOffset = stopPositionForPoint(cssGradientAngle, start);
  const length = hypot(difference);

  const stops = gradient.stops.map((stop) => {
    const adjustedPosition = stopPositionOffset + (stop.position * length / cssGradientLength);
    const percentage = Math.round(adjustedPosition * 100);

    // TODO: Use `colorToCss` once it's moved into this package.
    const {h, s, l, a} = stop.color;
    const color = `hsla(${h * 360}, ${s * 100}%, ${l * 100}%, ${a})`;
    return `${color} ${percentage}%`;
  });

  const degrees = Math.round(cssGradientAngle * 180 / Math.PI);
  return `linear-gradient(${degrees}deg, ${stops.join(', ')})`;
};
