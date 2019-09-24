import {Color} from '@diez/prefabs';
import {colorToCss} from '../src';

describe('colorToCss', () => {
  test('returns a string with a valid CSS <color> value from a Color prefab instance', () => {
    expect(colorToCss(new Color({h: 1, s: 1, l: 1, a: 1}))).toBe('hsla(360, 100%, 100%, 1)');
    expect(colorToCss(new Color({h: 1, s: 1, l: 1, a: 1}).fade(0.5))).toBe('hsla(360, 100%, 100%, 0.5)');
  });
});
