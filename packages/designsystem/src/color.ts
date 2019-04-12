import {Component, HashMap, property} from '@livedesigner/engine';

// For simplicity, Hue, Saturation, Lightness, and Alpha are all normalized in [0, 1].
export interface ColorState {
  h: number;
  s: number;
  l: number;
  a: number;
}

export interface RGBAColorState {
  r: number;
  b: number;
  g: number;
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
 * TODO.
 *
 * @noinheritdoc
 */
export class Color extends Component<ColorState> {
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

  static rgb (r: number, g: number, b: number) {
    return Color.rgba(r, g, b, 1);
  }

  static hsla (h: number, s: number, l: number, a: number) {
    return new Color({h, s, l, a});
  }

  static hsl (h: number, s: number, l: number) {
    return Color.hsla(h, s, l, 1);
  }

  static hex (hexCode: string) {
    const hexValue = hexCode.replace(/[^a-f0-9]/gi, '');
    switch (hexValue.length) {
      case 3:
      case 4:
        const shortValues = hexValue.split('').map((value) => parseInt(`${value}${value}`, 16));
        return hexRgb(shortValues[0], shortValues[1], shortValues[2], shortValues[3]);
      case 6:
      case 8:
        const matches = hexValue.match(/[a-f0-9]{2}/gi);
        if (matches) {
          const longValues = matches.map((value) => parseInt(value, 16));
          return hexRgb(longValues[0], longValues[1], longValues[2], longValues[3]);
        }
        break;
    }

    // Return with defaults if we were unable to parse.
    return new Color();
  }

  @property h: number = 0;

  @property s: number = 0;

  @property l: number = 0;

  @property a: number = 1;

  serialize () {
    return [normalizeUnit(this.h), normalizeUnit(this.s), normalizeUnit(this.l), normalizeUnit(this.a)];
  }

  lighten (amount: number) {
    return Color.hsla(this.h, this.s, this.l + amount, this.a);
  }

  darken (amount: number) {
    return Color.hsla(this.h, this.s, this.l - amount, this.a);
  }

  saturate (amount: number) {
    return Color.hsla(this.h, this.s + amount, this.l + amount, this.a);
  }

  desaturate (amount: number) {
    return Color.hsla(this.h, this.s - amount, this.l + amount, this.a);
  }

  fade (amount: number) {
    return Color.hsla(this.h, this.s, this.l, this.a - amount);
  }
}

export type Palette = HashMap<Color>;
