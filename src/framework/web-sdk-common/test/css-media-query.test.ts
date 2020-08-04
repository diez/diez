import {MediaQuery} from '@diez/prefabs';
import {queryToCss} from '../src';

describe('queriesToCSS', () => {
  test('min width to css', () => {
    expect(queryToCss(new MediaQuery({minWidth: 300}))).toBe('screen and (min-width: 300px)');
  });
});
