import {Font} from '@diez/prefabs';
import {fontToCss} from '../src';

describe('fontToCss', () => {
  test('declaration with fallbacks', () => {
    const font = new Font({name: 'Source Sans', fallbacks: ['Menlo', 'serif']});
    expect(fontToCss(font))
      .toBe('"Source Sans","Menlo",serif');
  });
  test('declaration without fallbacks', () => {
    const font = new Font({name: 'Source Sans', fallbacks: []});
    expect(fontToCss(font))
      .toBe('"Source Sans"');
  });
  test('declaration with unusual keyword fallbacks', () => {
    const font = new Font({name: 'Source Sans', fallbacks: ['emoji', 'fangsong']});
    expect(fontToCss(font))
      .toBe('"Source Sans",emoji,fangsong');
  });
});
