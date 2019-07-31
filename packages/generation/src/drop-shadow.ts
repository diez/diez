import {floatPrecision} from './constants';
import {GeneratedPoint2D, getPoint2DInitializer} from './point2d';

interface GeneratedDropShadow {
  colorInitializer: string;
  offset: GeneratedPoint2D;
  radius: number;
}

/**
 * Returns a drop shadow initializer.
 * @ignore
 */
export const getDropShadowInitializer = (shadow: GeneratedDropShadow) => {
  return `new DropShadow({offset: ${getPoint2DInitializer(shadow.offset)}, radius: ${shadow.radius.toFixed(floatPrecision)}, color: ${shadow.colorInitializer}})`;
};
