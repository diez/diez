import {execAsync, isMacOS, warning} from '@diez/cli-core';
import pascalCase from 'pascal-case';
import {join} from 'path';
import {GeneratedFont} from './api';
import {getColorInitializer} from './color';

interface FontLookup {
  name: string;
  style: string;
}

const fontCache = new Map<string, GeneratedFont>();

/**
 * Provides a best-effort lookup for a font in a given font family.
 */
export const locateFont = async (
  fontFamily: string,
  lookup: Partial<FontLookup>,
): Promise<GeneratedFont | undefined> => {
  const fontHash = `${fontFamily}|${lookup.name}|${lookup.style}`;
  if (fontCache.has(fontHash)) {
    return fontCache.get(fontHash);
  }

  if (isMacOS()) {
    const candidates = JSON.parse(await execAsync(`./MacFonts '${fontFamily}'`, {
      cwd: join(__dirname, '..', 'tools', 'mac-fonts', 'bin'),
    })) as GeneratedFont[];

    if (!candidates.length) {
      return;
    }

    if (lookup.name) {
      const match = candidates.find(({name}) => name === lookup.name);
      if (match) {
        fontCache.set(fontHash, match);
        return match;
      }
    }

    switch (lookup.style) {
      case 'italic':
        const italic = candidates.find(({style}) => style === 'Italic');
        if (italic) {
          fontCache.set(fontHash, italic);
          return italic;
        }
        break;
      case 'normal':
        const normal = candidates.find(({style}) => style === 'Regular');
        if (normal) {
          fontCache.set(fontHash, normal);
          return normal;
        }
        break;
    }

    fontCache.set(fontHash, candidates[0]);
    return candidates[0];
  }

  warning('Font location is not implemented on your platform.');
  return;
};

/**
 * Returns a color initializer based on primitive values.
 * @ignore
 */
export const getTypographInitializer = (
  designSystemName: string,
  candidateFont: GeneratedFont | undefined,
  fontName: string,
  fontSize: number,
  colorCssValue?: string,
) => {
  const font = candidateFont ?
    `${pascalCase(`${designSystemName} Fonts`)}.${pascalCase(candidateFont.family)}.${pascalCase(candidateFont.style)}` :
    `new Font({name: "${fontName}"})`;

  if (colorCssValue) {
    return `new Typograph({color: ${getColorInitializer(colorCssValue)}, font: ${font}, fontSize: ${fontSize}})`;
  }

  return `new Typograph({font: ${font}, fontSize: ${fontSize}})`;
};
