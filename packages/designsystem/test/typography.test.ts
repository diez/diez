import {Color, File, FontRegistry, TextStyle} from '../src';

describe('font registry', () => {
  test('basic functionality', () => {
    const src = 'bloop.ttf';
    const font = new FontRegistry({
      files: [new File({src})],
    });
    expect(font.serialize()).toEqual({files: [{src: 'bloop.ttf'}]});
  });
});

describe('text style', () => {
  test('basic functionality', () => {
    const enum Fonts {
      BloopMediumItalic = 'BloopMediumItalic',
    }

    const textStyle = new TextStyle<Fonts>({
      font: Fonts.BloopMediumItalic,
      fontSize: 50,
      color: Color.hsla(0, 0, 0, 0.5),
    });
    expect(textStyle.serialize()).toEqual({font: 'BloopMediumItalic', fontSize: 50, color: [0, 0, 0, 0.5]});
  });
});
