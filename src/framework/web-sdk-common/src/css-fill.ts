// Only used as a type.
// tslint:disable-next-line: no-implicit-dependencies
import {FillData, FillType} from '@diez/prefabs';
import {colorToCss} from './css-color';
import {linearGradientToCss} from './css-linear-gradient';

/**
 * Returns a string with a valid CSS <background> value from a Fill prefab instance.
 */
export const fillToBackgroundCss = (fill: FillData) => {
  switch (fill.type) {
    case FillType.Color:
      return colorToCss(fill.color);
    case FillType.LinearGradient:
      return linearGradientToCss(fill.linearGradient);
    default:
      throw Error(`Unsupported fill type: ${fill.type}`);
  }
};
