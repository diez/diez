import {Component, property} from '@diez/engine';
import {Color} from '@diez/prefabs';

/**
 * Note how this component is exported from `index.ts`. Diez compiles these
 * exported components for your apps' codebases.
 *
 * Check out https://beta.diez.org/getting-started to learn more.
 */
export class DesignSystem extends Component {
  @property red = Color.hex('#f00');
}
