import {Panel} from '@diez/prefabs';
import {cornerRadii, fills, shadows, typography} from './constants';

/**
 * Design of a single item in a list view.
 */
export class Pill {
  panel = new Panel({
    cornerRadius: cornerRadii.base,
    background: fills.secondary,
    dropShadow: shadows.transparent,
  });
  typograph = typography.small;
}
