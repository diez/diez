import {Size2D} from '../src/size2d';

describe('Size2D', () => {
  test('basic functionality', () => {
    const size = Size2D.make(400, 300);
    expect(size.serialize()).toEqual({width: 400, height: 300});
  });

  test('#toPresentableValue', () => {
    const size = Size2D.make(400, 300);
    expect(size.toPresentableValue()).toBe('(400 x 300)');
  });
});
