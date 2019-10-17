// Only used as a type.
// tslint:disable-next-line: no-implicit-dependencies
import {TextAlignment, TextDecoration} from '@diez/prefabs';

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

/**
 * Returns a string with a valid CSS <text-decoration> value from the provided `TextDecoration`.
 */
export const textDecorationsToCss = (decorations: TextDecoration[]) => {
  const components: string[] = [];

  if (decorations.includes(TextDecoration.Underline)) {
    components.push('underline');
  }

  if (decorations.includes(TextDecoration.Strikethrough)) {
    components.push('line-through');
  }

  if (components.length === 0) {
    return 'none';
  }

  return components.join(' ');
};
