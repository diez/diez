import {prefab} from '@diez/engine';

/**
 * Point data.
 */
export interface Point2DData {
  /**
   * The x value of the point.
   */
  x: number;
  /**
   * The y value of the point.
   */
  y: number;
}

/**
 * Provides a two dimensional point.
 *
 * Taken alone, points are designated in an abstract space with no inherit dimensions or directionality. In the
 * context of other prefabs like [[LinearGradient]], points typically should use the standard two dimensional graphics
 * space, often normalized in the unit square, where x increases from left to right and y increases from top to bottom.
 *
 * Usage: `point = Point2D.make(0.5, 0.5);`.
 *
 * @noinheritdoc
 */
export class Point2D extends prefab<Point2DData>() {
  defaults = {
    x: 0,
    y: 0,
  };

  /**
   * Creates a two dimensional point.
   */
  static make (x: number, y: number) {
    return new Point2D({x, y});
  }
}
