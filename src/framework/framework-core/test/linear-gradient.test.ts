import {cssLinearGradientLength, linearGradientStartAndEndPoints} from '../src/linear-gradient';

describe('linear-gradient', () => {
  test('cssLinearGradientLength', () => {
    expect(cssLinearGradientLength(0)).toBe(1);
    expect(cssLinearGradientLength(Math.PI / 2)).toBe(1);
    expect(cssLinearGradientLength(Math.PI / 4)).toBeCloseTo(Math.sqrt(2), 6);
    expect(cssLinearGradientLength(-Math.PI / 4)).toBeCloseTo(Math.sqrt(2), 6);
  });

  test('linearGradientStartAndEndPoints', () => {
    expect(linearGradientStartAndEndPoints(0, 1, {x: 0.5, y: 0.5})).toEqual({
      start: {x: 0.5, y: 1},
      end: {x: 0.5, y: 0},
    });

    expect(linearGradientStartAndEndPoints(Math.PI / 2, 1, {x: 0.5, y: 0.5})).toEqual({
      start: {x: 0, y: 0.5},
      end: {x: 1, y: 0.5},
    });

    expect(linearGradientStartAndEndPoints(Math.PI / 4, Math.sqrt(2), {x: 0.5, y: 0.5})).toEqual({
      start: {x: 0, y: 1},
      end: {x: 1, y: 0},
    });

    expect(linearGradientStartAndEndPoints(-Math.PI / 4, Math.sqrt(2), {x: 0.5, y: 0.5})).toEqual({
      start: {x: 1, y: 1},
      end: {x: 0, y: 0},
    });
  });
});
