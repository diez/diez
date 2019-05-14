import {Component, HashMap, property} from '@diez/engine';

/**
 * Provides simple hue-saturation-lightness-alpha color state.
 * @ignore
 */
export interface ColorState {
  h: number;
  s: number;
  l: number;
  a: number;
}

const getSaturation = (min: number, max: number, lightness: number) => {
  if (min === max) {
    return 0;
  }

  return (lightness < 0.5) ? (max - min) / (max + min) : (max - min) / (2 - max - min);
};

const normalizeHue = (degrees: number) => {
  if (degrees < 0) {
    return (degrees + 6) / 6;
  }

  return degrees / 6;
};

const getHue = (min: number, max: number, r: number, g: number, b: number) => {
  if (max === min) {
    return 0;
  }

  if (r === max) {
    return (g - b) / (max - min);
  }

  if (g === max) {
    return 2 + (b - r) / (max - min);
  }

  return 4 + (r - g) / (max - min);
};

const normalizeUnit = (x: number) => (Math.abs(x) > 1 ? x % 1 : x);

const hexRgb = (r: number, g: number, b: number, a: number = 255) => Color.rgba(r, g, b, a / 255);

/**
 * A component encapsulating color, including alpha transparency.
 *
 * You can use the provided static constructors [[Color.rgb]], [[Color.rgba]], [[Color.hsl]], [[Color.hsla]], and
 * [[Color.hex]] to conveniently create color primitives using familiar patterns for color specification.
 *
 * @noinheritdoc
 */
export class Color extends Component<ColorState> {
  /**
   * Creates an RGBA color.
   *
   * `@property red = Color.rgba(255, 0, 0, 1);`
   */
  static rgba (rIn: number, gIn: number, bIn: number, a: number) {
    const r = rIn / 255;
    const g = gIn / 255;
    const b = bIn / 255;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const l = (min + max) / 2;
    const s = getSaturation(min, max, l);
    const h = normalizeHue(getHue(min, max, r, g, b));
    return new Color({h, s, l, a});
  }

  /**
   * Creates an RGB color.
   *
   * `@property red = Color.rgb(255, 0, 0);`
   */
  static rgb (r: number, g: number, b: number) {
    return Color.rgba(r, g, b, 1);
  }

  /**
   * Creates an HSLA color.
   *
   * `@property red = Color.hsla(0, 1, 0.5, 1);`
   */
  static hsla (h: number, s: number, l: number, a: number) {
    return new Color({h, s, l, a});
  }

  /**
   * Creates an HSL color.
   *
   * `@property red = Color.hsl(0, 1, 0.5);`
   */
  static hsl (h: number, s: number, l: number) {
    return Color.hsla(h, s, l, 1);
  }

  /**
   * Creates a color from a hex code
   *
   * `@property red = Color.hex('#ff0');`
   *
   * 3, 4, 6, and 8 character hex specifications are supported. `#ff0`, `#ff0f`, `#ffff00`, and `#ffff00ff` should
   * all work.
   */
  static hex (hexCode: string) {
    const hexValue = hexCode.replace(/[^a-f0-9]/gi, '');
    switch (hexValue.length) {
      case 3:
      case 4:
        const shortValues = hexValue.split('').map((value) => parseInt(`${value}${value}`, 16));
        return hexRgb(shortValues[0], shortValues[1], shortValues[2], shortValues[3]);
      case 6:
      case 8:
        const matches = hexValue.match(/[a-f0-9]{2}/gi)!;
        const longValues = matches.map((value) => parseInt(value, 16));
        return hexRgb(longValues[0], longValues[1], longValues[2], longValues[3]);
    }

    // Return with defaults if we were unable to parse.
    return new Color();
  }

  @property h = 0;

  @property s = 0;

  @property l = 0;

  @property a = 1;

  /**
   * @ignore
   */
  serialize () {
    // Important: ensure all values are normalized in [0, 1] before serializing.
    return {
      h: normalizeUnit(this.h),
      s: normalizeUnit(this.s),
      l: normalizeUnit(this.l),
      a: normalizeUnit(this.a),
    };
  }

  /**
   * Lightens a color by the specified amount.
   *
   * `@property pink = this.red.lighten(0.5);`
   *
   * @returns A new Color instance after applying the specified lightener.
   */
  lighten (amount: number) {
    return Color.hsla(this.h, this.s, this.l + amount, this.a);
  }

  /**
   * Darkens a color by the specified amount.
   *
   * `@property maroon = this.red.darken(0.25);`
   *
   * @returns A new Color instance after applying the specified darkener.
   */
  darken (amount: number) {
    return this.lighten(-amount);
  }

  /**
   * Saturates a color by the specified amount.
   *
   * `@property bloodRed = this.mediumRed.saturate(0.25);`
   *
   * @returns A new Color instance after applying the specified saturater.
   */
  saturate (amount: number) {
    return Color.hsla(this.h, this.s + amount, this.l, this.a);
  }

  /**
   * Desaturates a color by the specified amount
   *
   * `@property grayRed = this.mediumRed.desaturate(0.25);`
   *
   * @returns A new Color instance after applying the specified desaturater.
   */
  desaturate (amount: number) {
    return this.saturate(-amount);
  }

  /**
   * Fades (reduces alpha transparency) by the specified amount.
   *
   * @returns A new Color instance after applying the specified fade.
   */
  fade (amount: number) {
    return Color.hsla(this.h, this.s, this.l, this.a - amount);
  }
}

/**
 * A `Palette` is a container for [[Color]]s.
 */
export type Palette = HashMap<Color>;
