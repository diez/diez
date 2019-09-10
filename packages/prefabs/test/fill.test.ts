import {Color} from '../src/color';
import {Fill} from '../src/fill';
import {LinearGradient, Toward} from '../src/linear-gradient';

describe('Fill', () => {
  test('color static constructor', () => {
    const color = Color.hsla(0.125, 0.25, 0.5, 0.75);
    const fill = Fill.color(color);
    expect(fill.serialize()).toEqual({
      color: color.serialize(),
      linearGradient: (new LinearGradient()).serialize(),
      type: 'Color',
    });
  });

  test('linear gradient static constructor', () => {
    const colorA = Color.hsla(0.125, 0.25, 0.5, 0.75);
    const colorB = Color.hsla(0.875, 0.25, 0.5, 0.75);
    const linearGradient = LinearGradient.make(Toward.Right, colorA, colorB);
    const fill = Fill.linearGradient(linearGradient);
    expect(fill.serialize()).toEqual({
      color: (Color.hsla(0, 0, 0, 0)).serialize(),
      linearGradient: linearGradient.serialize(),
      type: 'LinearGradient',
    });
  });
});
