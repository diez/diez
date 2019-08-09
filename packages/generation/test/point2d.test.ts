import {getPoint2DInitializer} from '../src/point2d';

describe('point2d', () => {
  test('initializer', () => {
    const point = {x: 0.1234567890, y:  0.1234567890};
    const initializer = getPoint2DInitializer(point);
    expect(initializer).toBe('Point2D.make(0.123456789, 0.123456789)');
  });
});
