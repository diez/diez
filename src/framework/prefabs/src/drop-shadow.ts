import {prefab} from '@diez/engine';
import {Color} from './color';
import {Point2D} from './point2d';

/**
 * DropShadow data.
 */
export interface DropShadowData {
  /**
   * The offset of the drop shadow.
   *
   * This is defined in a coordinate space where x+ is right and y+ is down.
   */
  offset: Point2D;
  /**
   * The blur radius of the drop shadow.
   *
   * This value assumes a Guassian blur and equals double the Guassian blur's standard deviation value.
   *
   * @see {@link https://drafts.csswg.org/css-backgrounds-3/#shadow-blur}
   */
  radius: number;
  /**
   * The color of the drop shadow.
   */
  color: Color;
}

/**
 * Provides a drop shadow.
 *
 * @noinheritdoc
 */
export class DropShadow extends prefab<DropShadowData>() {
  defaults = {
    offset: Point2D.make(0, 0),
    radius: 0,
    color: Color.rgb(0, 0, 0),
  };
}
