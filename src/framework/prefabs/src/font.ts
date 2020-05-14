import {prefab, Target} from '@diez/engine';
import {File, FileType} from './file';

/**
 * Valid face forms for `@font-face` declarations in web.
 */
export const enum FontStyle {
  Normal = 'normal',
  Italic = 'italic',
}

/**
 * Supported web font sources.
 */
export const enum WebFontSource {
  GoogleFonts = 'GoogleFonts',
  SelfHosted = 'SelfHosted',
}

const inferNameFromPath = (src: string) => {
  const pathComponents = src.split('/');
  const filename = pathComponents.pop() || '';
  return filename.slice(0, filename.lastIndexOf('.'));
};

/**
 * Font data.
 */
export interface FontData {
  /**
   * The font file containing the font's definition. Due to target limitations, the file _must_ be a TrueType file
   * with a `.ttf` extension or an OpenType file with an `.otf` extension.
   */
  file: File;
  /**
   * The exact, correct PostScript name of the font.
   */
  name: string;
  /**
   * An array of fallback fonts (web only).
   */
  fallbacks: string[];
  /**
   * The weight or boldness of the font (web only).
   */
  weight: number;
  /**
   * The font style (web only).
   */
  style: FontStyle;
  /**
   * The source of the web font (web only).
   */
  webFontSource: WebFontSource;
}

interface GoogleWebFontOptions {
  weight?: number;
  swap?: boolean;
  style?: FontStyle;
}

/**
 * A representation of a font resource, with a reference to a [[File]] containing a TTF or OTF font file.
 * @noinheritdoc
 */
export class Font extends prefab<FontData>() {
  defaults = {
    file: new File({type: FileType.Font}),
    name: '',
    fallbacks: ['sans-serif'],
    weight: 400,
    style: FontStyle.Normal,
    webFontSource: WebFontSource.SelfHosted,
  };

  options = {
    fallbacks: {targets: [Target.Web]},
    weight: {targets: [Target.Web]},
    style: {targets: [Target.Web]},
    webFontSource: {targets: [Target.Web]},
  };

  /**
   * Creates a Font component from a source file and its PostScript name.
   *
   * @param src - The relative path of the font file.
   * @param postscriptName - The correct PostScript name of the font contained by the font file. If blank, it is assumed
   *   the correct name is assumed to be the base name of the file minus its extension.
   */
  static fromFile (src: string, postscriptName?: string) {
    const name = (postscriptName === undefined) ? inferNameFromPath(src) : postscriptName;

    return new this({name, file: new File({src, type: FileType.Font})});
  }

  static googleWebFont (name: string, options: GoogleWebFontOptions) {
    return new this({name, weight: options.weight, webFontSource: WebFontSource.GoogleFonts});
  }

  toPresentableValue () {
    return `${this.name}, ${this.weight}, ${this.style}`;
  }
}
