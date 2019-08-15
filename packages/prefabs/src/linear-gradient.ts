import {prefab} from '@diez/engine';
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
}

/**
 * The direction of a linear gradient relative to the containing view's edges.
 */
export enum Toward {
  Top = 0,
  TopRight = 45,
  Right = 90,
  BottomRight = 135,
  Bottom = 180,
  BottomLeft = 225,
  Left = 270,
  TopLeft = 315,
}

/**
 * Gets the length of a CSS linear gradient line.
 *
 * @see {@link https://drafts.csswg.org/css-images-3/#funcdef-linear-gradient}
 */
export const cssLinearGradientLength = (angle: number) =>
  Math.abs(Math.sin(angle)) + Math.abs(Math.cos(angle));

/**
 * Generates a start and end point for a line from the provided angle, line length, and center position.
 *
 * @param angle: The angle of the line in radians where 0 is up and positive is clockwise.
 * @param lineLength: The length of the line.
 * @param center: The center position of the line.
 *
 * @returns The `start` and `end` points of a line in a coordinate space where positive x is to the right and positive
 *          y is downward.
 */
export const linearGradientStartAndEndPoints = (angle: number, lineLength: number, center: Point2DData) => {
  const differenceVector = {
    x: Math.sin(angle) * lineLength / 2,
    y: Math.cos(angle) * lineLength / 2,
  };
  const start = {
    x: center.x - differenceVector.x,
    y: 1 - (center.y - differenceVector.y),
  };
  const end = {
    x: center.x + differenceVector.x,
    y: 1 - (center.y + differenceVector.y),
  };
  return {start, end};
};

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
}
