import {prefab} from '@diez/engine';

/**
 * Defining the interface of your component's data enables you to instantiate your own
 * reusable components.
 */
interface MarginData {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Here we create a custom reusable component for describing layout margins.
 */
export class Margin extends prefab<MarginData>() {
  defaults = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Let's add in a helper method for defining margins (inspired by CSS shorthand).
   */
  static simple (vertical: number, maybeHorizontal?: number) {
    const horizontal = (maybeHorizontal === undefined) ? vertical : maybeHorizontal;

    return new Margin({
      top: vertical,
      bottom: vertical,
      left: horizontal,
      right: horizontal,
    });
  }
}
