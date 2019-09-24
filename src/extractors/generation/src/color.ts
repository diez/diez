import {get as getColorModel} from 'color-string';

/**
 * Returns a color initializer based on a CSS color value.
 * @ignore
 */
export const getColorInitializer = (cssValue: string) => {
  const cssModel = getColorModel(cssValue);
  if (cssModel === null) {
    return 'new Color()';
  }

  switch (cssModel.model) {
    case 'rgb':
      return `Color.rgba(${cssModel.value.join(', ')})`;
    case 'hsl':
      const [hDegrees, sPercent, lPercent, a] = cssModel.value;
      return `Color.hsla(${hDegrees / 360}, ${sPercent / 100}, ${lPercent / 100}, ${a})`;
    default:
      // TODO: add support for hwb, which might sneak in here.
      throw new Error(`Unsupported CSS color model: ${cssModel.model}`);
  }
};
