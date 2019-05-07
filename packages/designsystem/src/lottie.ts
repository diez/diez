import {Component, property} from '@diez/engine';
import {File} from './file';

/**
 * Lottie state.
 * @ignore
 */
export interface LottieState {
  file: File;
}

/**
 * Provides an abstraction for [Lottie](https://airbnb.io/lottie/#/) animations.
 *
 * @noinheritdoc
 */
export class Lottie extends Component<LottieState> {
  @property file: File = new File();

  /**
   * Creates a Lottie component from a source file, e.g.
   *
   * `const lottie = Lottie.fromJson('assets/lottie-files/animation.json');`
   */
  static fromJson (src: string) {
    return new Lottie({
      file: new File({src}),
    });
  }
}
