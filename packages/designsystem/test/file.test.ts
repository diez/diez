import {File} from '../src';

describe('File', () => {
  test('basic functionality', () => {
    const src = '/path/to/something big.jpg';
    const file = new File({src});
    expect(file.serialize()).toEqual({src: '/path/to/something%20big.jpg'});
    expect(file.basename).toBe('something big.jpg');
    expect(file.extension).toBe('jpg');
    expect(file.directory).toBe('/path/to');
  });
});
