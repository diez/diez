import {GeneratedPoint2D, getPoint2DInitializer} from './point2d';
import {roundFloat} from './utils';

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
  const offset = getPoint2DInitializer(shadow.offset);
  const radius = roundFloat(shadow.radius);
  return `new DropShadow({offset: ${offset}, radius: ${radius}, color: ${shadow.colorInitializer}})`;
};
