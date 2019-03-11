import {Component, property} from '@livedesigner/engine';
import {File} from './file';

export interface LottieState {
  file: File;
}

export class Lottie extends Component<LottieState> {
  @property file: File = new File();
}
