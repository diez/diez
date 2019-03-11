import {join} from 'path';
import {File, Image, SVG} from '../src';

describe('image', () => {
  test('basic functionality', () => {
    const src = join('path', 'to', 'image.jpg');
    const image = new Image({
      file: new File({src}),
      width: 640,
      height: 480,
      scale: 2,
    });
    expect(image.file.src).toBe(src);
    expect(image.serialize()).toEqual({file: {src}, width: 640, height: 480, scale: 2});
  });
});

describe('svg', () => {
  test('basic functionality', () => {
    const src = 'blah.svg';
    const image = new SVG({
      file: new File({src}),
    });
    expect(image.file.src).toBe(src);
    expect(image.serialize()).toEqual({file: {src}});
  });
});
