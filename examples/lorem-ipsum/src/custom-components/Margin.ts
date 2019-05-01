import {Component, property} from '@diez/engine';

/**
 * Defining the interface of your component's state enables you to instantiate your own
 * reusable components.
 */
interface MarginState {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Here we create a custom reusable component for describing layout margins.
 */
export class Margin extends Component<MarginState> {
  @property top = 0;
  @property bottom = 0;
  @property left = 0;
  @property right = 0;

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
