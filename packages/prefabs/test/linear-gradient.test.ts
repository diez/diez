import {Color} from '../src/color';
import {LinearGradient, Toward} from '../src/linear-gradient';
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
      start: Point2D.make(1.059225, 0.078594).serialize(),
      end: Point2D.make(-0.059225, 0.921406).serialize(),
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
      Color.hsl(0.25, 1, 0.5),
    ];
    const start = Point2D.make(0.0, 0);
    const end = Point2D.make(1, 1);
    const gradient = LinearGradient.makeWithPoints(start.x, start.y, end.x, end.y, ...colors);
    expect(gradient.serialize()).toEqual({
      start: start.serialize(),
      end: end.serialize(),
      stops: [
        {
          position: 0,
          color: colors[0].serialize(),
        },
      ],
    });
  });
});
