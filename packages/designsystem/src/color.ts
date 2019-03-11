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
  if (r === max) {
    return (g - b) / (max - min);
  }

  if (g === max) {
    return 2 + (b - r) / (max - min);
  }

  return 4 + (r - g) / (max - min);
};

const normalizeUnit = (x: number) => (x > 1 ? x % 1 : x);

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

  static hsla (h: number, s: number, l: number, a: number) {
    return new Color({h, s, l, a});
  }

  @property h: number = 0;

  @property s: number = 0;

  @property l: number = 0;

  @property a: number = 1;

  serialize () {
    return [normalizeUnit(this.h), normalizeUnit(this.s), normalizeUnit(this.l), normalizeUnit(this.a)];
  }
}

export type Palette = HashMap<Color>;
