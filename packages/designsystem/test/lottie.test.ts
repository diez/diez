import {Lottie} from '../src/lottie';

describe('lottie', () => {
  test('basic functionality', () => {
    const src = 'lottie.json';
    const image = Lottie.fromJson(src);
    expect(image.file.src).toBe(src);
    expect(image.serialize()).toEqual({file: {src}, loop: true, autoplay: true});
  });
});
