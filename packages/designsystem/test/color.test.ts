import {Color} from '../src/color';

describe('Color', () => {
  test('hsl[a] static constructor', () => {
    const red = Color.hsl(0, 1, 0.5);
    expect(red.serialize()).toEqual({h: 0, s: 1, l: 0.5, a: 1});
  });

  test('rgb[a] static constructor', () => {
    const red = Color.rgba(255, 0, 0, 1);
    expect(red.serialize()).toEqual({h: 0, s: 1, l: 0.5, a: 1});

    const green = Color.rgba(0, 255, 0, 1);
    expect(green.serialize()).toEqual({h: 1 / 3, s: 1, l: 0.5, a: 1});

    const lightBlue = Color.rgba(0, 0, 255, 0.5);
    expect(lightBlue.serialize()).toEqual({h: 2 / 3, s: 1, l: 0.5, a: 0.5});

    const black = Color.rgba(0, 0, 0, 1);
    expect(black.serialize()).toEqual({h: 0, s: 0, l: 0, a: 1});

    const white = Color.rgb(255, 255, 255);
    expect(white.serialize()).toEqual({h: 0, s: 0, l: 1, a: 1});
  });

  test('hex static constructor', () => {
    // Test 6/3 rgb shorthand.
    expect(Color.hex('#ff0000').serialize()).toEqual({h: 0, s: 1, l: 0.5, a: 1});
    expect(Color.hex('#f00').serialize()).toEqual({h: 0, s: 1, l: 0.5, a: 1});

    // Test 8/4 rgba shorthand.
    expect(Color.hex('#ff0000AA').serialize()).toEqual({h: 0, s: 1, l: 0.5, a: 2 / 3});
    expect(Color.hex('#f00A').serialize()).toEqual({h: 0, s: 1, l: 0.5, a: 2 / 3});

    // Invalid casts to black.
    expect(Color.hex('GGGGGG').serialize()).toEqual({h: 0, s: 0, l: 0, a: 1});
  });

  test('static helpers', () => {
    const red = Color.rgba(255, 0, 0, 1);
    expect(red.serialize()).toEqual({h: 0, s: 1, l: 0.5, a: 1});
    const darkRed = red.darken(0.25);
    expect(darkRed.serialize()).toEqual({h: 0, s: 1, l: 0.25, a: 1});
    const grayRed = red.desaturate(0.75);
    expect(grayRed.serialize()).toEqual({h: 0, s: 0.25, l: 0.5, a: 1});
    const alphaRed = red.fade(0.5);
    expect(alphaRed.serialize()).toEqual({h: 0, s: 1, l: 0.5, a: 0.5});
  });
});
