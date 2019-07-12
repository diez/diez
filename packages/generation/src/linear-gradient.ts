interface Point2D {
  x: number;
  y: number;
}

interface GradientStop {
  position: number;
  colorInitializer: string;
}

const FloatPrecision = 6;

const getPoint2DInitializer = (point: Point2D) =>
  `Point2D.make(${point.x.toFixed(FloatPrecision)}, ${point.y.toFixed(FloatPrecision)})`;

/**
 * Returns a linear gradient initializer.
 * @ignore
 */
export const getLinearGradientInitializer = (stops: GradientStop[], start: Point2D, end: Point2D) => {
  const colorStopInitializers = stops.map((stop) => {
    return `GradientStop.make(${stop.position.toFixed(FloatPrecision)}, ${stop.colorInitializer})`;
  });
  const colorStopInitializer = `[${colorStopInitializers.join(', ')}]`;
  return `new LinearGradient({stops: ${colorStopInitializer}, start: ${getPoint2DInitializer(start)}, end: ${getPoint2DInitializer(end)}})`;
};
