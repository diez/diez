import {Size2D} from '@diez/prefabs';
import {sizings, spacings, typography} from './constants';

class BreadcrumbIcon {
  size = Size2D.make(sizings.sm, sizings.sm);
  lateralSpacing = spacings.xs;
  scale = 0.7;
}

const icon = new BreadcrumbIcon();

/**
 * Breadcrumb.
 */
export class Breadcrumb {
  typograph = typography.copyItalic;
  icon = icon;
}
