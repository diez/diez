import {emptyDir, mkdirp, readFile, writeFile} from 'fs-extra';
import klawSync from 'klaw-sync';
import {tmpdir} from 'os';
import {extname, join} from 'path';
import {PNG} from 'pngjs';
import {v4} from 'uuid';

const RESERVED_CHAR_REPLACEMENT = '-';
const FILENAME_RESERVED_REGEX = /[<>:"\/\\|?*\x00-\x1F]/g;
const WINDOWS_NAMES_RESERVED_REGEX = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
export const BASE64_BITMAP_RE = /"data:image\/(png|jpe?g|gif);base64,(.*?)"/gi;
export const REDIRECT_URI_PORT = 3010;
export const REDIRECT_URI = `http://localhost:${REDIRECT_URI_PORT}/oauth/callback`;

export interface FileObject {
  fullPath: string;
  content: string;
  name: string;
}

export type FolderGroup = Map<string|number, string>;

export const enum IMAGE_FORMATS {
  png = 'png',
  svg = 'svg',
  jpg = 'jpg',
}

/**
 * Empties `basePath` and creates the provided `folders` inside.
 *
 * @param basePath path in which the folders will be created
 * @param folders
 */
export const createFolders = async (basePath: string, folders: FolderGroup) => {
  await emptyDir(basePath);
  return Promise.all([
    Array.from(folders).map(async ([_, folder]) => mkdirp(join(basePath, folder))),
  ]);
};

/**
 * Escapes a command to be safe for shell usage
 *
 * @param cmd command to escape
 */
export const escapeShell = (cmd: string) => {
  return cmd.replace(/(["\s'$`\\])/g, '\\$1');
};

/**
 * Sanitizes a file name
 *
 * @param name
 */
export const sanitizeFileName = (name: string) => {
  if (typeof name !== 'string') {
    return '';
  }

  return name
    .replace(FILENAME_RESERVED_REGEX, RESERVED_CHAR_REPLACEMENT)
    .replace(WINDOWS_NAMES_RESERVED_REGEX, RESERVED_CHAR_REPLACEMENT);
};

/**
 * Adjust gamma of PNG files to make them look consistent across browsers.
 *
 * @param base64data
 * @param imageFormat
 */
export const adjustImageGamma = (base64data: string, imageFormat: IMAGE_FORMATS) => {
  if (imageFormat === IMAGE_FORMATS.png && typeof base64data === 'string' && base64data.length) {
    try {
      const imageBufferData = Buffer.from(base64data, 'base64');
      const pngInstance = PNG.sync.read(imageBufferData);

      // 1/2.2 is a magic value found empirically after testing different values.
      pngInstance.gamma = 1 / 2.2;

      PNG.adjustGamma(pngInstance);
      const updatedBufferData = PNG.sync.write(pngInstance);
      return updatedBufferData.toString('base64');
    } catch (e) {
      return base64data;
    }
  }

  return base64data;
};

/**
 * Generates a random file name and path in the OS temporary directory
 *
 * @param extension file extension
 */
export const generateRandomFilePath = (extension = '') => {
  const fileName = `${v4()}.${extension}`;
  return join(tmpdir(), fileName);
};

/**
 * Fixes the gamma values of PNG files in a directory
 *
 * @param directory path to the directory to look for PNG files
 */
export const fixGammaOfPNGFiles = async (directory: string) => {
  const outputEntries = klawSync(directory, {nodir: true});

  for (const outputEntry of outputEntries) {
    if (extname(outputEntry.path) !== `.${IMAGE_FORMATS.svg}`) {
      continue;
    }

    const outputContents = await readFile(outputEntry.path).toString();
    const updatedContents = outputContents.replace(BASE64_BITMAP_RE, (matchString, imageFormat, base64data) => {
      return matchString.replace(
        base64data,
        adjustImageGamma(base64data, imageFormat),
      );
    });

    await writeFile(outputEntry.path, updatedContents);
  }
};
