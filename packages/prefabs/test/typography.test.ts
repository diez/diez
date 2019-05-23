import {Color} from '../src/color';
import {FontRegistry, Typograph} from '../src/typography';

describe('font registry', () => {
  test('basic functionality', () => {
    const src = 'bloop.ttf';
    const font = FontRegistry.fromFiles(src);
    expect(font.serialize()).toEqual({files: [{src: 'bloop.ttf'}]});
  });
});

describe('typograph', () => {
  test('basic functionality', () => {
    const enum Fonts {
      BloopMediumItalic = 'BloopMediumItalic',
    }

    const typograph = new Typograph({
      fontName: Fonts.BloopMediumItalic,
      fontSize: 50,
      color: Color.hsla(0, 0, 0, 0.5),
    });

    expect(typograph.serialize()).toEqual({
      fontName: 'BloopMediumItalic', fontSize: 50, color: {h: 0, s: 0, l: 0, a: 0.5}});
  });
});
