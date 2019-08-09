import {Color} from '../src/color';
import {GradientStop, LinearGradient, Toward} from '../src/linear-gradient';
import {Point2D} from '../src/point2d';

describe('linear-gradient', () => {
  test('make static constructor at 0 degrees', () => {
    const colors = [
      Color.hsl(0, 1, 0.5),
      Color.hsl(0.5, 1, 0.5),
    ];
    const gradient = LinearGradient.make(0, ...colors);
    expect(gradient.serialize()).toEqual({
      start: Point2D.make(0.5, 1).serialize(),
      end: Point2D.make(0.5, 0).serialize(),
      stops: [
        {
          position: 0,
          color: colors[0].serialize(),
        },
        {
          position: 1,
          color: colors[1].serialize(),
        },
      ],
    });
  });

  test('make static constructor at 135 degrees', () => {
    const colors = [
      Color.hsl(0, 1, 0.5),
      Color.hsl(0.5, 1, 0.5),
    ];
    const gradient = LinearGradient.make(135, ...colors);
    expect(gradient.serialize()).toEqual({
      start: Point2D.make(0, 0).serialize(),
      end: Point2D.make(1, 1).serialize(),
      stops: [
        {
          position: 0,
          color: colors[0].serialize(),
        },
        {
          position: 1,
          color: colors[1].serialize(),
        },
      ],
    });
  });

  test('make static constructor at 233 degrees', () => {
    const colors = [
      Color.hsl(0, 1, 0.5),
      Color.hsl(0.5, 1, 0.5),
    ];
    const gradient = LinearGradient.make(233, ...colors);
    expect(gradient.serialize()).toEqual({
      start: Point2D.make(1.059224762938829, 0.07859391496967).serialize(),
      end: Point2D.make(-0.059224762938829, 0.92140608503033).serialize(),
      stops: [
        {
          position: 0,
          color: colors[0].serialize(),
        },
        {
          position: 1,
          color: colors[1].serialize(),
        },
      ],
    });
  });

  test('make static constructor with a Toward value', () => {
    const colors = [
      Color.hsl(0, 1, 0.5),
      Color.hsl(0.5, 1, 0.5),
    ];
    const gradient = LinearGradient.make(Toward.TopRight, ...colors);
    expect(gradient.serialize()).toEqual({
      start: Point2D.make(0, 1).serialize(),
      end: Point2D.make(1, 0).serialize(),
      stops: [
        {
          position: 0,
          color: colors[0].serialize(),
        },
        {
          position: 1,
          color: colors[1].serialize(),
        },
      ],
    });
  });

  test('make points static constructor', () => {
    const colors = [
      Color.hsl(0, 1, 0.5),
      Color.hsl(0.5, 1, 0.5),
    ];
    const start = Point2D.make(0, 0);
    const end = Point2D.make(1, 1);
    const gradient = LinearGradient.makeWithPoints(0, 0, 1, 1, ...colors);
    expect(gradient.serialize()).toEqual({
      start: start.serialize(),
      end: end.serialize(),
      stops: [
        {
          position: 0,
          color: colors[0].serialize(),
        },
        {
          position: 1,
          color: colors[1].serialize(),
        },
      ],
    });
  });

  test('make constructor with one color should provide two stops', () => {
    const color = Color.hsl(0.25, 1, 0.5);
    const gradient = LinearGradient.make(Toward.Right, color);
    expect(gradient.serialize()).toEqual({
      start: Point2D.make(0, 0.5).serialize(),
      end: Point2D.make(1, 0.5).serialize(),
      stops: [
        {
          position: 0,
          color: color.serialize(),
        },
        {
          position: 1,
          color: color.serialize(),
        },
      ],
    });
  });

  test('make constructor with no colors should provide two stops', () => {
    const gradient = LinearGradient.make(Toward.Right);
    expect(gradient.serialize()).toEqual({
      start: Point2D.make(0, 0.5).serialize(),
      end: Point2D.make(1, 0.5).serialize(),
      stops: [
        {
          position: 0,
          color: Color.rgb(0, 0, 0).serialize(),
        },
        {
          position: 1,
          color: Color.rgb(0, 0, 0).serialize(),
        },
      ],
    });
  });

  test('initializer should construct a gradient with two stops when 1 stop is provided', () => {
    const start = Point2D.make(0, 0);
    const end = Point2D.make(1, 1);
    const color = Color.hsl(0.25, 1, 0.5);
    const stops = [GradientStop.make(0, color)];
    const gradient = new LinearGradient({start, end, stops});
    expect(gradient.serialize()).toEqual({
      start: start.serialize(),
      end: end.serialize(),
      stops: [
        {
          position: 0,
          color: color.serialize(),
        },
        {
          position: 1,
          color: color.serialize(),
        },
      ],
    });
  });

  test('initializer construct a gradient with two stops when 1 stop is provided', () => {
    const start = Point2D.make(0, 0);
    const end = Point2D.make(1, 1);
    const gradient = new LinearGradient({start, end, stops: []});
    expect(gradient.serialize()).toEqual({
      start: start.serialize(),
      end: end.serialize(),
      stops: [
        {
          position: 0,
          color: Color.rgb(0, 0, 0).serialize(),
        },
        {
          position: 1,
          color: Color.rgb(0, 0, 0).serialize(),
        },
      ],
    });
  });
});
