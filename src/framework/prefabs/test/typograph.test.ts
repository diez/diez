import {Color} from '../src/color';
import {Font, IOSTextStyle, Typograph} from '../src/typograph';

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
    });
  });
});
