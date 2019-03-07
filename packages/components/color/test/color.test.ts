import {Color} from '../src';

describe('Color', () => {
  test('hsla static constructor', () => {
    const color = Color.hsla(0, 1, 0.5, 1);
    expect(color.serialize()).toEqual([0, 1, 0.5, 1]);
  });

  test('rgba static constructor', () => {
    const red = Color.rgba(255, 0, 0, 1);
    expect(red.serialize()).toEqual([0, 1, 0.5, 1]);

    const green = Color.rgba(0, 255, 0, 1);
    expect(green.serialize()).toEqual([1 / 3, 1, 0.5, 1]);

    const lightBlue = Color.rgba(0, 0, 255, 0.5);
    expect(lightBlue.serialize()).toEqual([2 / 3, 1, 0.5, 0.5]);
  });
});
