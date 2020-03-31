type ColorData = import('@diez/prefabs').ColorData;

/**
 * Converts a color value from HSL to RGBA.
 */
export const hslToRgba = ({h, s, l, a}: ColorData) => {
  let r;
  let g;
  let b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgba(p, q, h + 1 / 3);
    g = hueToRgba(p, q, h);
    b = hueToRgba(p, q, h - 1 / 3);
  }

  return {a, r: r * 255, g: g * 255, b: b * 255};
};

const pad2 = (c: string) => c.padStart(2, '0');

/**
 * Converts a color value from HSL to HEX.
 */
export const hslToHex = ({h, s, l, a}: ColorData) => {
  const rgba = hslToRgba({h, s, l, a});
  return rgbaToHex(rgba);
};

/**
 * Converts a color value from RGBA to HEX.
 */
const rgbaToHex = ({r, g, b, a}: {r: number, g: number, b: number, a: number}) => {
  const hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
    pad2(Math.round(a * 255).toString(16)),
  ];

  return hex.join('');
};

/**
 * Converts a color value from HSL to RGBA.
 */
const hueToRgba = (p: number, q: number, tp: number) => {
  let t = tp;

  if (t < 0) {
    t += 1;
  }

  if (t > 1) {
    t -= 1;
  }

  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }

  if (t < 1 / 2) {
    return q;
  }

  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }

  return p;
};

const round = (n: number) => {
  return Math.round(n * 100) / 100;
};

/**
 * User friendly, rounded representation of a color in HSLA format.
 */
export const displayableHsla = (hsl: ColorData) => {
  return `hsla(${round(hsl.h)}, ${round(hsl.s)}, ${round(hsl.l)}, ${round(hsl.a)})`;
};

/**
 * User friendly, rounded representation of a color in RGBA format.
 */
export const displayableRgba = (hsl: ColorData) => {
  const rgb = hslToRgba(hsl);
  return `rgba(${round(rgb.r)}, ${round(rgb.g)}, ${round(rgb.b)}, ${round(hsl.a)})`;
};
