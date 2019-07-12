import {PoodleSurfSlices} from './PoodleSurf.sketch';
import {Component, property} from '@diez/engine';
import {LayoutValues, palette, typographs} from './constants';

/**
 * The navigation title design.
 */
export class NavigationTitleDesign extends Component {
  @property barTintColor = palette.colors.white;
  @property icon = PoodleSurfSlices.Icon;
  @property title = 'P o o d l e S u r f';
  @property typograph = typographs.headerTitle;
  @property iconToTitleSpacing = LayoutValues.DefaultSpacing;
}
