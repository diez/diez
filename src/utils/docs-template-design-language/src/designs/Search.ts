import {Panel, Size2D} from '@diez/prefabs';
import {cornerRadii, fills, shadows} from './constants';

/**
 * Search bar.
 */
export class Search {
  panel = new Panel({
    background: fills.secondary,
    cornerRadius: cornerRadii.base,
    dropShadow: shadows.transparent,
  });
  size = new Size2D({height: 35});
}
