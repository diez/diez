// Only used as a type.
// tslint:disable-next-line: no-implicit-dependencies
import {TextAlignment} from '@diez/prefabs';

/**
 * Returns a string with a valid CSS <text-align> value from the provided `TextAlignment`.
 */
export const textAlignmentToCss = (alignment: TextAlignment) => {
  switch (alignment) {
    case TextAlignment.Natural:
      return 'start';
    case TextAlignment.Left:
      return 'left';
    case TextAlignment.Right:
      return 'right';
    case TextAlignment.Center:
      return 'center';
    default:
      throw Error(`Unsupported text alignment: ${alignment}`);
  }
};
