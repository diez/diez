import {Component, property} from '@livedesigner/engine';
import {LoadingDesign, palette, ReportDesign, textStyles} from './designs';

class Designs extends Component {
  @property report = new ReportDesign();
  @property loading = new LoadingDesign();
}

/**
 * The design system for Poodle Surf.
 */
export class DesignSystem extends Component {
  @property palette = palette;
  @property textStyles = textStyles;
  @property designs = new Designs();
}
