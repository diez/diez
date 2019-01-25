import {join} from 'path';
import {File} from '../src';

describe('File', () => {
  test('basic functionality', () => {
    const src = join('path', 'to', 'something.jpg');
    const file = new File({src});
    expect(file.serialize()).toEqual({src});
    expect(file.basename).toBe('something.jpg');
    expect(file.extension).toBe('jpg');
    expect(file.directory).toBe(join('path', 'to'));
  });
});
