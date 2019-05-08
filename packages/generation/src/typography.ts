import {execAsync, isMacOS, warning} from '@diez/cli-core';
import {join} from 'path';

interface DiezFont {
  name: string;
  style: string;
  path: string;
}

interface FontLookup {
  name: string;
  style: string;
}

const fontCache = new Map<string, DiezFont>();

/**
 * Provides a best-effort lookup for a font in a given font family.
 */
export const locateFont = async (fontFamily: string, lookup: Partial<FontLookup>): Promise<DiezFont | undefined> => {
  const fontHash = `${fontFamily}|${lookup.name}|${lookup.style}`;
  if (fontCache.has(fontHash)) {
    return fontCache.get(fontHash);
  }

  if (isMacOS()) {
    const candidates = JSON.parse(await execAsync(`./MacFonts '${fontFamily}'`, {
      cwd: join(__dirname, '..', 'tools', 'mac-fonts', 'bin'),
    })) as DiezFont[];

    if (!candidates.length) {
      return;
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
