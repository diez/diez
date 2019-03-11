import {Component, property} from '@livedesigner/engine';
import {File} from './file';

export interface HaikuState {
  file: File;
  // TODO: add support for Haiku options.
  // TODO: add support for dimensions.
}

export class Haiku extends Component<HaikuState> {
  @property file = new File();
}
