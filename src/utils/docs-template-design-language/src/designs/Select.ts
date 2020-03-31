import {Panel, Size2D} from '@diez/prefabs';
import {cornerRadii, fills, shadows, typography} from './constants';

/**
 * Default styles for `<select>` elements.
 */
export class Select {
  panel = new Panel({
    background: fills.secondary,
    cornerRadius: cornerRadii.base,
    dropShadow: shadows.transparent,
  });
  size = new Size2D({height: 35});
  typograph = typography.mediumBlack;
}
