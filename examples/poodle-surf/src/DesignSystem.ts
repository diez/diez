import {Component, property} from '@diez/engine';
import {LoadingDesign, NavigationTitleDesign, palette, ReportDesign, textStyles, fontRegistry} from './designs';

class Designs extends Component {
  @property report = new ReportDesign();
  @property loading = new LoadingDesign();
  @property navigationTitle = new NavigationTitleDesign();
}

/**
 * The design system for Poodle Surf.
 */
export class DesignSystem extends Component {
  @property palette = palette;
  @property fontRegistry = fontRegistry;
  @property textStyles = textStyles;
  @property designs = new Designs();
}
