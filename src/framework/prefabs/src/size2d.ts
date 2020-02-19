import {prefab} from '@diez/engine';

/**
 * Size data.
 */
export interface Size2DData {
  /**
   * The width value of the size.
   */
  width: number;
  /**
   * The height value of the size.
   */
  height: number;
}

/**
 * Provides a two dimensional size.
 *
 * Usage: `size = Size2D.make(1920, 1080);`.
 *
 * @noinheritdoc
 */
export class Size2D extends prefab<Size2DData>() {
  defaults = {
    width: 0,
    height: 0,
  };

  /**
   * Creates a two dimensional size.
   */
  static make (width: number, height: number) {
    return new Size2D({width, height});
  }

  toPresentableValue () {
    return `(${this.width} x ${this.height})`;
  }
}
