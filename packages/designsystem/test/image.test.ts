import {join} from 'path';
import {Image, SVG} from '../src/image';

describe('image', () => {
  test('basic functionality', () => {
    const src1x = join('path', 'to', 'image.jpg');
    const src2x = join('path', 'to', 'image@2x.jpg');
    const src3x = join('path', 'to', 'image@3x.jpg');
    const image = Image.responsive(join('path', 'to', 'image'), 'jpg', 640, 480);
    expect(image.file1x.src).toBe(src1x);
    expect(image.file2x.src).toBe(src2x);
    expect(image.file3x.src).toBe(src3x);
    expect(image.serialize()).toEqual({
      file1x: {src: src1x},
      file2x: {src: src2x},
      file3x: {src: src3x},
      width: 640,
      height: 480,
    });
  });
});

describe('svg', () => {
  test('basic functionality', () => {
    const src = 'blah.svg';
    const image = new SVG({src});
    expect(image.src).toBe(src);
    expect(image.serialize()).toEqual({src});
  });
});
