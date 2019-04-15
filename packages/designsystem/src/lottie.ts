import {Component, property} from '@diez/engine';
import {File} from './file';

export interface LottieState {
  file: File;
}

export class Lottie extends Component<LottieState> {
  @property file: File = new File();

  static fromJson (src: string) {
    return new Lottie({
      file: new File({src}),
    });
  }
}
