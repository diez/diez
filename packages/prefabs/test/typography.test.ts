import {Color} from '../src/color';
import {Font, Typograph} from '../src/typography';

describe('font', () => {
  test('basic functionality', () => {
    expect(Font.fromFile('Whatever.ttf', 'Bloop-MediumItalic').name).toBe('Bloop-MediumItalic');
    expect(Font.fromFile('Whatever.ttf').name).toBe('Whatever');
  });
});

describe('typograph', () => {
  test('basic functionality', () => {
    const typograph = new Typograph({
      font: Font.fromFile('Bloop-MediumItalic.ttf', 'Bloop-MediumItalic'),
      fontSize: 50,
      color: Color.hsla(0, 0, 0, 0.5),
    });

    expect(typograph.serialize()).toEqual({
      font: {file: {src: 'Bloop-MediumItalic.ttf', type: 'font'}, name: 'Bloop-MediumItalic'},
      fontSize: 50,
      color: {h: 0, s: 0, l: 0, a: 0.5},
    });
  });
});
