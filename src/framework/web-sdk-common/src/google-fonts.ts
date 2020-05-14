export interface GoogleFontVariation {
  style: string;
  weight: number;
}

export class GoogleFont {
  private variations = new Set<string>();

  constructor (private name: string, variations: GoogleFontVariation[] = []) {
    for (const variation of variations) {
      this.setVariation(variation);
    }
  }

  private getHashedName () {
    return this.name.replace(/ /g, '+');
  }

  private getHashedVariations () {
    return [...this.variations].join(',');
  }

  hash () {
    if (this.variations.size === 0) {
      return '';
    }

    return `${this.getHashedName()}:${this.getHashedVariations()}`;
  }

  setVariation ({style = 'normal', weight = 400}: GoogleFontVariation) {
    this.variations.add(`${weight}${style}`);
  }
}

export class GoogleFontCollection {
  private baseUrl = 'https://fonts.googleapis.com/css';
  private collections: Map<string, GoogleFont> = new Map();

  set (fontName: string, {weight, style}: GoogleFontVariation) {
    const font = this.collections.get(fontName) || new GoogleFont(fontName);
    font.setVariation({style, weight});
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
