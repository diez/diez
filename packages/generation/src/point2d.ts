import {roundFloat} from './utils';

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
  `Point2D.make(${roundFloat(point.x)}, ${roundFloat(point.y)})`;
