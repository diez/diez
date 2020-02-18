import {prefab} from '@diez/engine';
import {cssLinearGradientLength, linearGradientStartAndEndPoints} from '@diez/framework-core';
import {Color} from './color';
import {Point2D, Point2DData} from './point2d';

/**
 * GradientStop data.
 */
export interface GradientStopData {
  /**
   * The position of this color within a gradient as percentage value where 1.0 is 100%. The stop position can be less
   * than 0 or greater than 1.
   */
  position: number;
  /**
   * The color at this stop position within a gradient.
   */
  color: Color;
}

/**
 * Provides a gradient stop.
 *
 * @noinheritdoc
 */
export class GradientStop extends prefab<GradientStopData>() {
  defaults = {
    position: 0,
    color: Color.rgb(0, 0, 0),
  };

  /**
   * Creates an gradient stop.
   *
   * `const gradientStop = GradientStop.make(0, Color.rgb(255, 0, 0));`
   */
  static make (position: number, color: Color) {
    return new GradientStop({position, color});
  }

  toPresentableValue () {
    return `${this.color.toPresentableValue()} at ${this.position}`;
  }
}

/**
 * The direction of a linear gradient relative to the containing view's edges.
 */
export const enum Toward {
  Top = 0,
  TopRight = 45,
  Right = 90,
  BottomRight = 135,
  Bottom = 180,
  BottomLeft = 225,
  Left = 270,
  TopLeft = 315,
}

const roundFloat = (value: number, decimals: number = 15) =>
  Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

const roundPoint = (point: Point2DData) => {
  return {
    x: roundFloat(point.x),
    y: roundFloat(point.y),
  };
};

const pointsFromAngle = (degrees: number) => {
  const radians = degrees * (Math.PI / 180);
  const length = cssLinearGradientLength(radians);
  const center = {x: 0.5, y: 0.5};
  const {start, end} = linearGradientStartAndEndPoints(radians, length, center);
  return {
    start: roundPoint(start),
    end: roundPoint(end),
  };
};

const stopsFromColors = (...colors: Color[]) => {
  const lastIndex = colors.length - 1;
  return colors.map((color, index) => GradientStop.make(index / lastIndex || 0, color));
};

/**
 * LinearGradient data.
 */
export interface LinearGradientData {
  /**
   * The color stops within the gradient.
   *
   * The position of a stop is represented as a percentage value where 1.0 is 100%. The stop position can be less than
   * 0 or greater than 1.
   */
  stops: GradientStop[];
  /**
   * The start position of the gradient in a coordinate space where (0, 0) is top left and (1, 1) is bottom right.
   */
  start: Point2D;
  /**
   * The end position of the gradient in a coordinate space where (0, 0) is top left and (1, 1) is bottom right.
   */
  end: Point2D;
}

/**
 * Provides a linear gradient.
 *
 * @noinheritdoc
 */
export class LinearGradient extends prefab<LinearGradientData>() {
  defaults = {
    stops: [
      GradientStop.make(0, Color.rgb(0, 0, 0)),
      GradientStop.make(1, Color.rgb(255, 255, 255)),
    ],
    start: Point2D.make(0, 0),
    end: Point2D.make(1, 1),
  };

  /**
   * Constructs a linear gradient using an angle in degrees, or a [[Toward]] value, that specifies the direction of the
   * `LinearGradient`, where 0 degrees generates a gradient from bottom to top and positive is clockwise.
   *
   * @param angle: The direction that the linear gradient is generated in. This can be a number (in degrees) or a
   *               [[Toward]] value (e.g. `Toward.TopRight`).
   * @param colors: The colors that make up the gradient.
   *
   * `gradient = LinearGradient.make(Toward.TopRight, Color.rgb(255, 0, 0), Color.rgb(0, 0, 255));`
   */
  static make (angle: Toward | number, ...colors: Color[]) {
    const {start, end} = pointsFromAngle(angle);
    const stops = stopsFromColors(...colors);
    return new LinearGradient({
      stops,
      start: new Point2D(start),
      end: new Point2D(end),
    });
  }

  /**
   * Creates a multi-colored gradient between the provided start and end points.
   *
   * (0, 0) represents the top left.
   * (1, 1) represents the bottom right.
   *
   * `gradient = LinearGradient.makeWithPoints(0, 0, 1, 1, Color.rgb(255, 0, 0), Color.rgb(0, 0, 255));`
   */
  static makeWithPoints (x1: number, y1: number, x2: number, y2: number, ...colors: Color[]) {
    const stops = stopsFromColors(...colors);
    return new LinearGradient({
      stops,
      start: Point2D.make(x1, y1),
      end: Point2D.make(x2, y2),
    });
  }

  sanitize (data: LinearGradientData) {
    if (!data.stops.length) {
      const stop = GradientStop.make(0, Color.rgb(0, 0, 0));
      data.stops.push(stop);
    }

    if (data.stops.length < 2) {
      const stop = GradientStop.make(1, data.stops[0].color);
      data.stops.push(stop);
    }

    return data;
  }

  toPresentableValue () {
    return `start ${this.start.toPresentableValue()}, end ${this.end.toPresentableValue()}, stops: [${this.stops.map((stop) => stop.toPresentableValue())}]`;
  }
}
