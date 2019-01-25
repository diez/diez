import {File} from '@livedesigner/file';
import {join} from 'path';
import {Image} from '../src';

describe('index', () => {
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
