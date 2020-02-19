import {File} from '../src/file';

describe('File', () => {
  test('basic functionality', () => {
    const src = '/path/to/something big.jpg';
    const file = new File({src});
    expect(file.serialize()).toEqual({src: '/path/to/something%20big.jpg', type: 'raw'});
  });

  test('#toPresentableValue', () => {
    const src = '/path/to/something big.jpg';
    const file = new File({src});
    expect(file.toPresentableValue()).toBe(src);
  });
});
