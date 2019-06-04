import {Image, Vector} from '../src/image';

describe('image', () => {
  test('basic functionality', () => {
    const image = Image.responsive('path/to/image.png', 640, 480);
    expect(image.serialize()).toEqual({
      file: {src: 'path/to/image.png', type: 'image'},
      file2x: {src: 'path/to/image@2x.png', type: 'image'},
      file3x: {src: 'path/to/image@3x.png', type: 'image'},
      file4x: {src: 'path/to/image@4x.png', type: 'image'},
      width: 640,
      height: 480,
    });
  });
});

describe('vector', () => {
  test('basic functionality', () => {
    const src = 'blah.svg';
    const image = new Vector({src});
    expect(image.src).toBe(src);
    expect(image.serialize()).toEqual({src});
  });
});
