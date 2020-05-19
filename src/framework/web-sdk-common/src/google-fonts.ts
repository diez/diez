// Only used as a type.
// tslint:disable-next-line: no-implicit-dependencies
import {FontData, FontStyle, GoogleWebFontData} from '@diez/prefabs';

/**
 * Encapsulates logic to handle multiple Google Fonts variants under the same
 * font family.
 */
export class GoogleFont {
  private variants = new Set<string>();

  constructor (private name: string, variants: GoogleWebFontData[] = []) {
    for (const variation of variants) {
      this.addVariant(variation);
    }
  }

  static isGoogleFont (font: FontData) {
    return font.file.type === 'remote';
  }

  private getHashedName () {
    return this.name.replace(/ /g, '+');
  }

  private getHashedVariations () {
    return [...this.variants].join(',');
  }

  hash () {
    if (this.variants.size === 0) {
      return '';
    }

    return `${this.getHashedName()}:${this.getHashedVariations()}`;
  }

  addVariant ({style = 'normal' as FontStyle, weight = 400}: GoogleWebFontData) {
    this.variants.add(`${weight}${style}`);
  }
}

/**
 * Encapsulates logic to manage a collection of [[GoogleFont]]s methods to fetch
 * the fonts from the Google Fonts servers.
 */
export class GoogleFontCollection {
  private baseUrl = 'https://fonts.googleapis.com/css';
  private collections: Map<string, GoogleFont> = new Map();

  set (fontName: string, data: GoogleWebFontData) {
    const font = this.collections.get(fontName) || new GoogleFont(fontName);
    font.addVariant(data);
    this.collections.set(fontName, font);
  }

  get url () {
    const collections = [];

    for (const font of this.collections.values()) {
      collections.push(font.hash());
    }

    return `${this.baseUrl}?family=${collections.join('%7C')}&swap=true`;
  }
}
