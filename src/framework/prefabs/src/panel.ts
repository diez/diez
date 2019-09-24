import {prefab, Target} from '@diez/engine';
import {DropShadow} from './drop-shadow';
import {Fill} from './fill';

/**
 * Panel data.
 */
export interface PanelData {
  /**
   * The corner radius of the panel.
   */
  cornerRadius: number;
  /**
   * The background of the panel.
   */
  background: Fill;
  /**
   * The drop shadow for the panel. Used on all platforms except for Android.
   */
  dropShadow: DropShadow;
  /**
   * The elevation of the panel to determine the drop shadow appearance on Android only.
   *
   * @see {@link: https://material.io/design/environment/elevation.html}
   */
  elevation: number;
}

/**
 * Provides a simple rectangular panel description.
 *
 * @noinheritdoc
 */
export class Panel extends prefab<PanelData>() {
  defaults = {
    cornerRadius: 0,
    background: new Fill(),
    dropShadow: new DropShadow(),
    elevation: 0,
  };

  options = {
    dropShadow: {targets: [Target.Ios, Target.Web]},
    elevation: {targets: [Target.Android]},
  };
}
