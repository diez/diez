// Only used as a type.
// tslint:disable-next-line: no-implicit-dependencies
import {FontData} from '@diez/prefabs';

/**
 * Known font formats supported in Web.
 */
export const FontFormats = {
  eot: 'embedded-opentype',
  woff: 'woff',
  woff2: 'woff2',
  otf: 'opentype',
  ttf: 'truetype',
  svg: 'svg',
};

/**
 * Collection of well-known generic font-family names.
 */
const keywords = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'math', 'emoji', 'fangsong'];

/**
 * Returns a string with quoted `<family-names>` and unquoted `<generic-names>`.
 */
const sanitizeFonts = (fontFamilies: string[]) => {
  return fontFamilies.map((font) => keywords.includes(font) ? font : `"${font}"`);
};

/**
 * Returns a sanitized string with a valid CSS `<family-name>`s followed by `<generic-name>`s.
 */
export const fontToCss = (font: FontData) => {
  const fontFamilies = [];

  if (font.name) {
    fontFamilies.push(font.name);
  }

  fontFamilies.push(...font.fallbacks);

  return sanitizeFonts(fontFamilies).join();
};
