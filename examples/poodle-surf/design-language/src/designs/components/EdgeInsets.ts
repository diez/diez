import {prefab} from '@diez/engine';

interface EdgeInsetsData {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Provides inset to be used for layout margins, etc.
 */
export class EdgeInsets extends prefab<EdgeInsetsData>() {
  defaults = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

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
