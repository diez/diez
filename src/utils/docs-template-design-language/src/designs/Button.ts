import {Panel} from '@diez/prefabs';
import {cornerRadii, fills} from './constants';

/**
 * Default `<button>` styles.
 */
export class Button {
  panel = new Panel({
    background: fills.primary,
    cornerRadius: cornerRadii.base,
  });
  panelActive = new Panel({
    background: fills.secondary,
  });
}
