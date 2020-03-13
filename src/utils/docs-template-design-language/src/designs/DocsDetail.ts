import {Panel, Size2D} from '@diez/prefabs';
import {cornerRadii, fills, sizings} from './constants';

/**
 * Details preview for a given item.
 */
export class DocsDetail {
  panel = new Panel({
    background: fills.primary,
    cornerRadius: cornerRadii.base,
  });
  size = new Size2D({height: sizings.lg});
}
