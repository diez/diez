import {Lottie} from '../src/lottie';

describe('lottie', () => {
  test('basic functionality', () => {
    const src = 'lottie.json';
    const image = Lottie.fromJson(src);
    expect(image.serialize()).toEqual({file: {src, type: 'raw'}, loop: true, autoplay: true});
  });
});
