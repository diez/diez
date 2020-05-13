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

const DiezFontStyles: Record<string, string> = {
  regular: 'FontStyle.Normal',
  italic: 'FontStyle.Italic',
  bold: 'FontStyle.Bold',
};

/**
 * TODO
 */
export abstract class FontCollectionCreator {
  private collection = new Map<string, string>();
  protected abstract collectionName: string;

  protected addToCollection (family: string, style: string, weight: number, staticConstructor: string) {
    const fontName = pascalCase(`${family}-${FontWeightName[weight]}${weight}-${style === 'regular' ? '' : style}`);
    const initializer = `Font.${staticConstructor}('${family}', {weight: ${weight}, style: ${DiezFontStyles[style]}})`;
    this.collection.set(fontName, initializer);
  }

  generateTypescriptFile () {
    const entries = [];
    for (const [font, initializer] of this.collection.entries()) {
      entries.push(`${font}: ${initializer}`);
    }

    return `import {Font, FontStyle} from '../font';

/**
 * TODO
 */
export const ${this.collectionName} = {
  ${entries.join(',\n  ')},
};
`;
  }
}

/**
 * TODO
 */
export class GoogleFontCollectionCreator extends FontCollectionCreator {
  protected collectionName = 'GoogleFonts';

  private parseVariation (variation: string) {
    const weight = variation.match(/^([0-9]+)/);
    const style = variation.match(/([A-Za-z]+)$/i);
    return {weight: weight ? Number(weight[0]) : 400, style: style ? style[0] : 'regular'};
  }

  set (family: string, variant: string) {
    const {style, weight} = this.parseVariation(variant);
    super.addToCollection(family, style, weight, 'googleWebFont');
  }
}
