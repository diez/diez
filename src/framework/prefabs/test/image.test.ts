import {Image} from '../src/image';
import {Size2D} from '../src/size2d';

describe('image', () => {
  test('basic functionality', () => {
    const image = Image.responsive('path/to/image.png', 640, 480);
    expect(image.serialize()).toEqual({
      file: {src: 'path/to/image.png', type: 'image'},
      file2x: {src: 'path/to/image@2x.png', type: 'image'},
      file3x: {src: 'path/to/image@3x.png', type: 'image'},
      file4x: {src: 'path/to/image@4x.png', type: 'image'},
      size: Size2D.make(640, 480).serialize(),
    });
  });

  test('#toPresentableValue', () => {
    const image = Image.responsive('path/to/image.png', 640, 480);
    expect(image.toPresentableValue()).toBe(`path/to/image.png (640 x 480)`);
  });
});
