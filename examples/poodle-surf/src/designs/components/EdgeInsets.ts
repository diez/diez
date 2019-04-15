import {Component, property} from '@diez/engine';

interface EdgeInsetsState {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Provides inset to be used for layout margins, etc.
 */
export class EdgeInsets extends Component<EdgeInsetsState> {
  @property top = 0;
  @property bottom = 0;
  @property left = 0;
  @property right = 0;

  /**
   * A helper method for defining edge insets inspired by CSS shorthand.
   *
   * If not horizontal inset is provided, all edges will use the vertical inset.
   */
  static simple (verticalInset: number, horizontalInset?: number) {
    const horizontalInsetActual = (horizontalInset === undefined) ? verticalInset : horizontalInset;

    return new EdgeInsets({
      top: verticalInset,
      bottom: verticalInset,
      left: horizontalInsetActual,
      right: horizontalInsetActual,
    });
  }
}
