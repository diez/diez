import {interpolateNumbers} from '../src/transitions';

describe('transitions', () => {
  test('interpolateNumbers', () => {
    const linearCurve = (t: number) => t;
    const sineCurve = (t: number) => Math.sin(Math.PI / 2 * t);

    expect(interpolateNumbers(0, 0, 0, 0, 0, linearCurve)).toBe(0);
    expect(interpolateNumbers(0, 0, 0, 100, 0, linearCurve)).toBe(0);

    expect(interpolateNumbers(0, 100, 0, 100, 0, linearCurve)).toBe(0);
    expect(interpolateNumbers(0, 100, 0, 100, 50, linearCurve)).toBe(50);
    expect(interpolateNumbers(0, 100, 0, 100, 100, linearCurve)).toBe(100);

    expect(interpolateNumbers(100, 200, 100, 200, 100, linearCurve)).toBe(100);
    expect(interpolateNumbers(100, 200, 100, 200, 150, linearCurve)).toBe(150);
    expect(interpolateNumbers(100, 200, 100, 200, 200, linearCurve)).toBe(200);

    expect(interpolateNumbers(0, 1000, 0, 100, 0, linearCurve)).toBe(0);
    expect(interpolateNumbers(0, 1000, 0, 100, 50, linearCurve)).toBe(500);
    expect(interpolateNumbers(0, 1000, 0, 100, 100, linearCurve)).toBe(1000);

    expect(interpolateNumbers(0, 100, 0, 100, 0, sineCurve)).toBe(0);
    expect(interpolateNumbers(0, 100, 0, 100, 50, sineCurve)).toBe(100 * Math.sin(Math.PI / 4));
    expect(interpolateNumbers(0, 100, 0, 100, 100, sineCurve)).toBe(100);
  });
});
