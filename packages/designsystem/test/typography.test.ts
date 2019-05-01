import {Color} from '../src/color';
import {FontRegistry, TextStyle} from '../src/typography';

describe('font registry', () => {
  test('basic functionality', () => {
    const src = 'bloop.ttf';
    const font = FontRegistry.fromFiles(src);
    expect(font.serialize()).toEqual({files: [{src: 'bloop.ttf'}]});
  });
});

describe('text style', () => {
  test('basic functionality', () => {
    const enum Fonts {
      BloopMediumItalic = 'BloopMediumItalic',
    }

    const textStyle = new TextStyle({
      fontName: Fonts.BloopMediumItalic,
      fontSize: 50,
      color: Color.hsla(0, 0, 0, 0.5),
    });

    expect(textStyle.serialize()).toEqual({
      fontName: 'BloopMediumItalic', fontSize: 50, color: {h: 0, s: 0, l: 0, a: 0.5}});
  });
});
