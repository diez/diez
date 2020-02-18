import {Point2D} from '../src/point2d';

describe('Point2D', () => {
  test('basic functionality', () => {
    const point = Point2D.make(0.5, 0.5);
    expect(point.serialize()).toEqual({x: 0.5, y: 0.5});
  });

  test('#toPresentableValue', () => {
    const point = Point2D.make(0.5, 0.5);
    expect(point.toPresentableValue()).toBe('[0.5, 0.5]');
  });
});
