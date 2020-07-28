import {MediaQuery} from '@diez/prefabs';
import {queriesToCss} from '../src';

describe('queriesToCSS', () => {
  test('min width to css', () => {
    expect(queriesToCss(MediaQuery.minWidth(300))).toBe('screen and (min-width: 300px)');
  });
});
