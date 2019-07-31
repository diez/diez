import {Color} from '../src/color';
import {DropShadow} from '../src/drop-shadow';
import {Point2D} from '../src/point2d';

describe('DropShadow', () => {
  test('basic functionality', () => {
    const color = Color.hsla(0, 0.25, 0.5, 0.75);
    const point = Point2D.make(1, 2);
    const shadow = new DropShadow({
      color,
      offset: point,
      radius: 3,
    });
    expect(shadow.serialize()).toEqual({
      color: {
        h: 0,
        s: 0.25,
        l: 0.5,
        a: 0.75,
      },
      offset: {
        x: 1,
        y: 2,
      },
      radius: 3,
    });
  });
});
