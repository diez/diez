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
 * Abstraction to parse font data from different sources into an internal
 * standard format.
 *
 * @ignore
 */
abstract class FontCollectionParser {
  readonly abstract name: string;
  readonly abstract instanceConstructor: string;
  collection = new Map<string, string>();

  protected abstract parseVariation (variant: string): {style: string, weight: number};

  protected addToCollection (family: string, style: string, weight: number) {
    this.collection.set(
      pascalCase(`${family}-${FontWeightName[weight]}${weight}-${style === 'regular' ? '' : style}`),
      `${this.instanceConstructor}('${family}', {weight: ${weight}, style: ${DiezFontStyle[style]}})`,
    );
  }

  parse (family: string, variant: string) {
    const {style, weight} = this.parseVariation(variant);
    this.addToCollection(family, style, weight);
  }
}

/**
 * Parses responses from the Google Fonts Developer API into a format that can
 * be easily consumed.
 *
 * @ignore
 */
export class GoogleFontParser extends FontCollectionParser {
  readonly name = 'GoogleWebFonts';
  readonly instanceConstructor = 'Font.googleWebFont';

  protected parseVariation (variation: string) {
    const weight = variation.match(/^([0-9]+)/);
    const style = variation.match(/([A-Za-z]+)$/);
    return {weight: weight ? Number(weight[0]) : 400, style: style ? style[0] : 'regular'};
  }
}

/**
 * Generates output based on data from a [[FontCollectionParser]]
 *
 * @ignore
 */
export class FontCollectionGenerator {
  static generateTypeScriptEnum (parser: FontCollectionParser) {
    const entries = [];
    for (const [font, initializer] of parser.collection.entries()) {
      entries.push(`${font}: ${initializer}`);
    }

    return `import {Font, FontStyle} from '../font';

/**
 * As a convenience, this enumeration provides the names of all the core fonts supported on ${this.name}.
 */
export const ${parser.name} = {
  ${entries.join(',\n  ')},
};
`;
  }
}
