interface GoogleFontVariant {
  style: string;
  weight: number;
}

/**
 * TODO
 */
export class GoogleFont {
  private variants = new Set<string>();

  constructor (private name: string, variants: GoogleFontVariant[] = []) {
    for (const variation of variants) {
      this.addVariant(variation);
    }
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

  addVariant ({style = 'normal', weight = 400}: GoogleFontVariant) {
    this.variants.add(`${weight}${style}`);
  }
}

/**
 * TODO
 */
export class GoogleFontCollection {
  private baseUrl = 'https://fonts.googleapis.com/css';
  private collections: Map<string, GoogleFont> = new Map();

  set (fontName: string, {weight, style}: GoogleFontVariant) {
    const font = this.collections.get(fontName) || new GoogleFont(fontName);
    font.addVariant({style, weight});
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
