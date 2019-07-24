interface GeneratedPoint2D {
  x: number;
  y: number;
}

interface GeneratedGradientStop {
  position: number;
  colorInitializer: string;
}

const FloatPrecision = 6;

const getPoint2DInitializer = (point: GeneratedPoint2D) =>
  `Point2D.make(${point.x.toFixed(FloatPrecision)}, ${point.y.toFixed(FloatPrecision)})`;

/**
 * Returns a linear gradient initializer.
 * @ignore
 */
export const getLinearGradientInitializer = (stops: GeneratedGradientStop[], start: GeneratedPoint2D, end: GeneratedPoint2D) => {
  const colorStopInitializers = stops.map((stop) => {
    return `GradientStop.make(${stop.position.toFixed(FloatPrecision)}, ${stop.colorInitializer})`;
  });
  const colorStopInitializer = `[${colorStopInitializers.join(', ')}]`;
  return `new LinearGradient({stops: ${colorStopInitializer}, start: ${getPoint2DInitializer(start)}, end: ${getPoint2DInitializer(end)}})`;
};
