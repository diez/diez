import {prefab} from '@diez/engine';
import {Color} from './color';
import {LinearGradient} from './linear-gradient';

/**
 * The type of fill.
 */
export enum FillType {
  Color = 'Color',
  LinearGradient = 'LinearGradient',
}

/**
 * Fill data.
 */
export interface FillData {
  /**
   * The color value of the fill when `type` is `Color`.
   *
   * If type is not `Color` then this value is invalid and should not be read.
   */
  color: Color;
  /**
   * The linear gradient value of the fill when `type` is `LinearGradient`.
   *
   * If type is not `LinearGradient` then this value is invalid and should not be read.
   */
  linearGradient: LinearGradient;
  /**
   * The type of fill.
   *
   * The value of this type determines which property is considered a valid value for the fill.
   */
  type: FillType;
}

/**
 * Describes a fill type.
 *
 * @noinheritdoc
 */
export class Fill extends prefab<FillData>() {
  defaults = {
    color: new Color(),
    linearGradient: new LinearGradient(),
    type: FillType.Color,
  };

  /**
   * Creates a color fill.
   *
   * `const colorFill = Fill.color(Color.rgb(255, 0, 0));`
   */
  static color (color: Color) {
    return new Fill({color, type: FillType.Color});
  }

  /**
   * Creates a linear gradient fill.
   *
   * `const linearGradientFill = Fill.linearGradient(LinearGradient.make(Toward.Right, Color.rgb(255, 0, 0), Color.rgb(0, 255, 0)));`
   */
  static linearGradient (linearGradient: LinearGradient) {
    return new Fill({linearGradient, type: FillType.LinearGradient});
  }
}
