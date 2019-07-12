import {Component, property} from '@diez/engine';
import {Color} from './color';
import {Point2D} from './point2d';

/**
 * GradientStop state.
 * @ignore
 */
export interface GradientStopState {
  position: number;
  color: Color;
}

/**
 * Provides a gradient stop.
 *
 * @noinheritdoc
 */
export class GradientStop extends Component<GradientStopState> {
  /**
   * The position of this color within a gradient as percentage value where 1.0 is 100%. The stop position can be less
   * than 0 or greater than 1.
   */
  @property position = 0;
  /**
   * The color at this stop position within a gradient.
   */
  @property color = Color.rgb(0, 0, 0);

  /**
   * Creates an gradient stop.
   *
   * `const gradientStop = GradientStop.make(0, Color.rgb(255, 0, 0));`
   */
  static make (position: number, color: Color) {
    return new GradientStop({position, color});
  }
}

/**
 * LinearGradient state.
 * @ignore
 */
export interface LinearGradientState {
  stops: GradientStop[];
  start: Point2D;
  end: Point2D;
}

/**
 * Provides a linear gradient.
 *
 * @noinheritdoc
 */
export class LinearGradient extends Component<LinearGradientState> {
  /**
   * The color stops within the gradient.
   *
   * The position of a stop is represented as a percentage value where 1.0 is 100%. The stop position can be less than
   * 0 or greater than 1.
   */
  @property stops = [
    GradientStop.make(0, Color.rgb(0, 0, 0)),
    GradientStop.make(1, Color.rgb(1, 1, 1)),
  ];
  /**
   * The start position of the gradient in a coordinate space where (0, 0) is top left and (1, 1) is bottom right.
   */
  @property start = Point2D.make(0, 0);
  /**
   * The end position of the gradient in a coordinate space where (0, 0) is top left and (1, 1) is bottom right.
   */
  @property end = Point2D.make(1, 1);

  /**
   * Creates a multi-colored gradient between the provided start and end points.
   *
   * (0, 0) represents the top left.
   * (1, 1) represents the bottom right.
   *
   * `@property gradient = LinearGradient.make(Point.make(0, 0), Point.make(1, 1), Color.rgb(255, 0, 0), Color.rgb(0, 0, 255));`
   */
  static simple (start: Point2D, end: Point2D, ...colors: Color[]) {
    const lastIndex = colors.length - 1;
    const stops = colors.map((color, index) => GradientStop.make(index / lastIndex || 0, color));
    return new LinearGradient({start, end, stops});
  }

  /**
   * Creates a multi-color vertical linear gradient where the colors are equally distributed.
   *
   * `@property gradient = Gradient.simpleVertical(Color.rgb(255, 0, 0), Color.rgb(0, 0, 255));`
   */
  static simpleVertical (...colors: Color[]) {
    return LinearGradient.simple(Point2D.make(0.5, 0.0), Point2D.make(0.5, 1.0), ...colors);
  }

  /**
   * Creates a multi-color horizontal linear gradient where the colors are equally distributed.
   *
   * `@property gradient = Gradient.simpleHorizontal(Color.rgb(255, 0, 0), Color.rgb(0, 0, 255));`
   */
  static simpleHorizontal (...colors: Color[]) {
    return LinearGradient.simple(Point2D.make(0.0, 0.5), Point2D.make(1.0, 0.5), ...colors);
  }
}
