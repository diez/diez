import {Component, property} from '@diez/engine';

/**
 * Haiku state.
 * @ignore
 */
export interface HaikuState {
  component: string;
  loop: boolean;
  autoplay: boolean;
}

/**
 * Provides an abstraction for a [Haiku Animator](https://www.haikuforteams.com) component.
 *
 * Usage: `@property haiku = new Haiku({component: '@haiku/component-name'});`
 *
 * @noinheritdoc
 */
export class Haiku extends Component<HaikuState> {
  @property component = '';
  @property loop = true;
  @property autoplay = true;
}
