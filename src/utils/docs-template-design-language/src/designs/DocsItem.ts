import {Panel, Size2D} from '@diez/prefabs';
import {cornerRadii, fills, shadows, sizings, spacings} from './constants';

class DocsItemDetails {
  openSize = Size2D.make(230, 230);
  spacing = spacings.sm;
  panel = new Panel({
    cornerRadius: cornerRadii.base,
    dropShadow: shadows.popover,
    background: fills.primary,
  });
}

const details = new DocsItemDetails();

/**
 * Design of a single item in a list view.
 */
export class DocsItem {
  size = new Size2D({
    width: sizings.md,
    height: sizings.sm,
  });
  panel = new Panel({
    cornerRadius: cornerRadii.base,
    background: fills.primary,
  });
  details = details;
}
