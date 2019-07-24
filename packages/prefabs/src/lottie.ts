import {prefab} from '@diez/engine';
import {File} from './file';

/**
 * Lottie data.
 */
export interface LottieData {
  file: File;
  loop: boolean;
  autoplay: boolean;
}

/**
 * Provides an abstraction for [Lottie](https://airbnb.io/lottie/#/) animations.
 *
 * @noinheritdoc
 */
export class Lottie extends prefab<LottieData>() {
  defaults = {
    file: new File(),
    loop: true,
    autoplay: true,
  };

  /**
   * Creates a Lottie component from a source file, e.g.
   *
   * `const lottie = Lottie.fromJson('assets/lottie-files/animation.json', true, true);`
   */
  static fromJson (src: string, loop?: boolean, autoplay?: boolean) {
    return new Lottie({
      loop,
      autoplay,
      file: new File({src}),
    });
  }
}
