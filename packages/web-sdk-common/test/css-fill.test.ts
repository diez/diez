import {Color, Fill, LinearGradient, Toward} from '@diez/prefabs';
import {fillToBackgroundCss} from '../src';

describe('fillToBackgroundCss', () => {
  test('color', () => {
    const color = Color.hsla(1, 1, 1, 1);
    const fill = Fill.color(color);
    expect(fillToBackgroundCss(fill)).toBe('hsla(360, 100%, 100%, 1)');
  });

  test('linear gradient', () => {
    const colorA = Color.hsla(0, 0, 0, 0);
    const colorB = Color.hsla(1, 1, 1, 1);
    const linearGradient = LinearGradient.make(Toward.BottomRight, colorA, colorB);
    const fill = Fill.linearGradient(linearGradient);
    expect(fillToBackgroundCss(fill))
      .toBe('linear-gradient(135deg, hsla(0, 0%, 0%, 0) 0%, hsla(360, 100%, 100%, 1) 100%)');
  });
});
