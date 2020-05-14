import {pascalCase} from 'change-case';

const FontWeightName: Record<number, string> = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
};

const DiezFontStyle: Record<string, string> = {
  regular: 'FontStyle.Normal',
  italic: 'FontStyle.Italic',
  bold: 'FontStyle.Bold',
};

/**
 * Abstract class wrapping the basic functionalities to collect Font data
 * and generate TypeScript code with Font prefab instances.
 * @ignore
 */
abstract class FontCollection {
  private collection = new Map<string, string>();
  protected abstract name: string;
  protected abstract instanceConstructor: string;

  protected addToCollection (family: string, style: string, weight: number) {
    this.collection.set(
      pascalCase(`${family}-${FontWeightName[weight]}${weight}-${style === 'regular' ? '' : style}`),
      `${this.instanceConstructor}('${family}', {weight: ${weight}, style: ${DiezFontStyle[style]}})`,
    );
  }

  toTypeScriptEnum () {
    const entries = [];
    for (const [font, initializer] of this.collection.entries()) {
      entries.push(`${font}: ${initializer}`);
    }

    return `import {Font, FontStyle} from '../font';

/**
 * As a convenience, this enumeration provides the names of all the core fonts supported on ${this.name}.
 */
export const ${this.name} = {
  ${entries.join(',\n  ')},
};
`;
  }
}

/**
 * Utility class to collect and generate TypeScript code from Google Fonts.
 * @ignore
 */
export class GoogleFontCollection extends FontCollection {
  protected name = 'GoogleWebFonts';
  protected instanceConstructor = 'Font.googleWebFont';

  private parseVariation (variation: string) {
    const weight = variation.match(/^([0-9]+)/);
    const style = variation.match(/([A-Za-z]+)$/);
    return {weight: weight ? Number(weight[0]) : 400, style: style ? style[0] : 'regular'};
  }

  set (family: string, variant: string) {
    const {style, weight} = this.parseVariation(variant);
    super.addToCollection(family, style, weight);
  }
}
