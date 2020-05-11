import {Color} from '../src/color';
import {Font, GoogleWebFonts, IOSTextStyle, TextAlignment, TextDecoration, Typograph} from '../src/typograph';

describe('typograph', () => {
  test('basic functionality', () => {
    const typograph = new Typograph({
      font: Font.fromFile('Bloop-MediumItalic.ttf'),
      fontSize: 50,
      color: Color.hsla(0, 0, 0, 0.5),
      shouldScale: true,
      iosTextStyle: IOSTextStyle.Title1,
      lineHeight: 20,
      letterSpacing: 5,
      alignment: TextAlignment.Center,
      decoration: [TextDecoration.Underline, TextDecoration.Strikethrough],
    });

    expect(typograph.serialize()).toEqual({
      font: {
        file: {src: 'Bloop-MediumItalic.ttf', type: 'font'},
        name: 'Bloop-MediumItalic',
        style: 'normal',
        weight: 400,
        fallbacks: ['sans-serif'],
      },
      fontSize: 50,
      color: {h: 0, s: 0, l: 0, a: 0.5},
      shouldScale: true,
      iosTextStyle: 'title1',
      lineHeight: 20,
      letterSpacing: 5,
      alignment: 'center',
      decoration: ['underline', 'strikethrough'],
    });

    const typographWithSpecificName = new Typograph({
      font: Font.fromFile('Bloop-MediumItalic.ttf', 'SomethingElse'),
      fontSize: 50,
      color: Color.hsla(0, 0, 0, 0.5),
      iosTextStyle: IOSTextStyle.Title2,
    });

    expect(typographWithSpecificName.serialize()).toEqual({
      font: {
        file: {src: 'Bloop-MediumItalic.ttf', type: 'font'},
        name: 'SomethingElse',
        style: 'normal',
        weight: 400,
        fallbacks: ['sans-serif'],
      },
      fontSize: 50,
      color: {h: 0, s: 0, l: 0, a: 0.5},
      shouldScale: false,
      iosTextStyle: 'title2',
      lineHeight: -1,
      letterSpacing: 0,
      alignment: 'natural',
      decoration: [],
    });
  });

  test('sanitization', () => {
    const typographWithSpecificName = new Typograph({
      font: Font.fromFile('Bloop-MediumItalic.ttf', 'SomethingElse'),
      fontSize: -10,
      color: Color.hsla(0, 0, 0, 0.5),
      iosTextStyle: IOSTextStyle.Title2,
      lineHeight: -10,
    });

    expect(typographWithSpecificName.serialize()).toEqual({
      font: {
        file: {src: 'Bloop-MediumItalic.ttf', type: 'font'},
        name: 'SomethingElse',
        style: 'normal',
        weight: 400,
        fallbacks: ['sans-serif'],
      },
      fontSize: 0,
      color: {h: 0, s: 0, l: 0, a: 0.5},
      shouldScale: false,
      iosTextStyle: 'title2',
      lineHeight: 0,
      letterSpacing: 0,
      alignment: 'natural',
      decoration: [],
    });
  });

  test('google webfonts', () => {
    const googleWebFont = Font.googleWebFont('Open Sans Condensed', {swap: true, weight: 700});

    expect(googleWebFont.serialize()).toEqual({
      file: {src: '', type: 'font'},
      name: 'Open Sans Condensed',
      style: 'normal',
      weight: 700,
      fallbacks: ['sans-serif'],
    });

    expect(GoogleWebFonts.MontserratBlack.serialize()).toEqual({
      file: {src: '', type: 'font'},
      name: 'Montserrat Black',
      style: 'normal',
      weight: 900,
      fallbacks: ['sans-serif'],
    });
  });

  describe('Font', () => {
    it('#toPresentableValue', () => {
      const font = Font.fromFile('Bloop-MediumItalic.ttf');
      expect(font.toPresentableValue()).toBe('Bloop-MediumItalic, 400, normal');
    });
  });
});
