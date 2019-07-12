import {Color} from '../src/color';
import {LinearGradient} from '../src/linear-gradient';
import {Point2D} from '../src/point2d';

describe('linear-gradient', () => {
  test('simple static constructor', () => {
    const colors = [
      Color.hsl(0.25, 1, 0.5),
    ];
    const start = Point2D.make(0.5, 0);
    const end = Point2D.make(0.5, 1);
    const gradient = LinearGradient.simple(start, end, ...colors);
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

  test('simple horizontal static constructor', () => {
    const colors = [
      Color.hsl(0, 1, 0.5),
      Color.hsl(0.5, 1, 0.5),
    ];
    const gradient = LinearGradient.simpleHorizontal(...colors);
    expect(gradient.serialize()).toEqual({
      start: Point2D.make(0, 0.5).serialize(),
      end: Point2D.make(1, 0.5).serialize(),
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

  test('simple vertical static constructor', () => {
    const colors = [
      Color.hsl(0, 1, 0.5),
      Color.hsl(0.25, 1, 0.5),
      Color.hsl(0.5, 1, 0.5),
    ];
    const gradient = LinearGradient.simpleVertical(...colors);
    expect(gradient.serialize()).toEqual({
      start: Point2D.make(0.5, 0).serialize(),
      end: Point2D.make(0.5, 1.0).serialize(),
      stops: [
        {
          position: 0,
          color: colors[0].serialize(),
        },
        {
          position: 0.5,
          color: colors[1].serialize(),
        },
        {
          position: 1,
          color: colors[2].serialize(),
        },
      ],
    });
  });
});
