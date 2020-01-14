import {execAsync, isMacOS, Log} from '@diez/cli-core';
import {camelCase, pascalCase} from 'change-case';
import {join} from 'path';
import {GeneratedFont, SerializedTypographData} from './api';
import {objectToSource} from './utils';

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
    const candidates: GeneratedFont[] = [];
    try {
      candidates.push(...JSON.parse(await execAsync(`./MacFonts '${fontFamily}'`, {
        cwd: join(__dirname, '..', 'tools', 'mac-fonts', 'bin'),
      })));
    } catch (error) {
      // Noop. For some reason, we were not able to run the MacFonts binary on this machine.
    }

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

  Log.warning('Font location is not implemented on your platform.');
  return;
};

/**
 * Returns a color initializer based on primitive values.
 * @ignore
 */
export const getTypographInitializer = (
  designLanguageName: string,
  candidateFont: GeneratedFont | undefined,
  fontName: string,
  typographData: Partial<SerializedTypographData>,
) => {
  const font = candidateFont ?
    `${camelCase(`${designLanguageName} Fonts`)}.${pascalCase(candidateFont.family)}.${pascalCase(candidateFont.style)}` :
    `new Font({name: "${fontName}"})`;

  Object.assign(typographData, {font});
  return `new Typograph(${objectToSource(typographData)})`;
};
