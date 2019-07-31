import {floatPrecision} from './constants';

/**
 * A 2D point.
 * @ignore
 */
export interface GeneratedPoint2D {
  x: number;
  y: number;
}

/**
 * Returns a 2D point initializer.
 * @ignore
 */
export const getPoint2DInitializer = (point: GeneratedPoint2D) =>
  `Point2D.make(${point.x.toFixed(floatPrecision)}, ${point.y.toFixed(floatPrecision)})`;
