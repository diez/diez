import {Component, property} from '@diez/engine';

export interface HaikuState {
  component: string;
  // TODO: add support for Haiku options.
}

/**
 * TODO.
 *
 * @noinheritdoc
 */
export class Haiku extends Component<HaikuState> {
  @property component = '';
}
