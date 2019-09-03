import {PoodleSurfSlices} from './PoodleSurf.sketch';
import {LayoutValues, palette, typographs} from './constants';

/**
 * The navigation title design.
 */
export class NavigationTitleDesign {
  barTintColor = palette.background;
  icon = PoodleSurfSlices.Icon;
  title = 'P o o d l e S u r f';
  typograph = typographs.headerTitle;
  iconToTitleSpacing = LayoutValues.DefaultSpacing;
}
