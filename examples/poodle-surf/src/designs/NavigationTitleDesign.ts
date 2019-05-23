import {Image} from '@diez/prefabs';
import {Component, property} from '@diez/engine';
import {Images} from './assets';
import {LayoutValues, palette, typographs} from './constants';

/**
 * The navigation title design.
 */
export class NavigationTitleDesign extends Component {
  @property barTintColor = palette.white;
  @property icon = Images.Icon;
  @property title = 'P o o d l e S u r f';
  @property typograph = typographs.headerTitle;
  @property iconToTitleSpacing = LayoutValues.DefaultSpacing;
}
