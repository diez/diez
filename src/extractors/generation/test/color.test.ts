import {getColorInitializer} from '../src/color';

describe('color', () => {
  test('initializers', () => {
    expect(getColorInitializer('invalid')).toBe('new Color()');
    expect(getColorInitializer('rgba(255, 0, 0, 0.5)')).toBe('Color.rgba(255, 0, 0, 0.5)');
    expect(getColorInitializer('hsla(360, 100%, 50%, 0.3)')).toBe('Color.hsla(0, 1, 0.5, 0.3)');
    expect(() => getColorInitializer('hwb(0, 0%, 0%)')).toThrow();
  });
});
