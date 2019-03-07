import {File} from '@livedesigner/file';
import {Lottie} from '../src';

describe('lottie', () => {
  test('basic functionality', () => {
    const src = 'blah.svg';
    const image = new Lottie({
      file: new File({src}),
    });
    expect(image.file.src).toBe(src);
    expect(image.serialize()).toEqual({file: {src}});
  });
});
