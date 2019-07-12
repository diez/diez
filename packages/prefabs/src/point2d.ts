import {Component, property} from '@diez/engine';

/**
 * Point state.
 * @ignore
 */
export interface Point2DState {
  x: number;
  y: number;
}

/**
 * Provides a two dimensional point.
 *
 * Taken alone, points are designated in an abstract space with no inherit dimensions or directionality. In the
 * context of other prefabs like [[LinearGradient]], points typically should use the standard two dimensional graphics
 * space, often normalized in the unit square, where x increases from left to right and y increases from top to bottom.
 *
 * Usage: `@property point = Point2D.make(0.5, 0.5);`.
 *
 * @noinheritdoc
 */
export class Point2D extends Component<Point2DState> {
  /**
   * The x value of the point.
   */
  @property x = 0;
  /**
   * The y value of the point.
   */
  @property y = 0;

  /**
   * Creates a two dimensional point.
   */
  static make (x: number, y: number) {
    return new Point2D({x, y});
  }
}
