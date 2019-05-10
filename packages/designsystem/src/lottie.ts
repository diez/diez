import {Component, property} from '@diez/engine';
import {File} from './file';

/**
 * Lottie state.
 * @ignore
 */
export interface LottieState {
  file: File;
  loop: boolean;
  autoplay: boolean;
}

/**
 * Provides an abstraction for [Lottie](https://airbnb.io/lottie/#/) animations.
 *
 * @noinheritdoc
 */
export class Lottie extends Component<LottieState> {
  @property file: File = new File();
  @property loop = true;
  @property autoplay = true;

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
