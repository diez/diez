import {Component, property} from '@diez/engine';
import {palette, spacing, sizing, borderRadius, typography} from './constants';

export class DesignSystem extends Component {
  @property palette = palette;
  @property spacing = spacing;
  @property sizing = sizing;
  @property borderRadius = borderRadius;
  @property typography = typography;
}
