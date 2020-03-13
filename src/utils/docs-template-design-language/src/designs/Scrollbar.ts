import {Panel, Size2D} from '@diez/prefabs';
import {cornerRadii, fills} from './constants';

/**
 * Scrollbar custom styles.
 */
export class Scrollbar {
  panel = new Panel({
    cornerRadius: cornerRadii.base,
    background: fills.contrast,
  });
  size = new Size2D({width: 5});
}
