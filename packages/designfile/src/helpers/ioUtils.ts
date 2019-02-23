import {exec} from 'child_process';
import {emptyDir, mkdirp, readFile, writeFile} from 'fs-extra';
import klawSync from 'klaw-sync';
import {platform, tmpdir} from 'os';
import {extname, join} from 'path';
import {PNG} from 'pngjs';
import {v4} from 'uuid';

const reservedCharReplacement = '-';
const filenameReservedRegExp = /[<>:"\/\\|?*\x00-\x1F]/g;
const windowsNamesReservedRegExp = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
export const base64BitMapRegExp = /"data:image\/(png|jpe?g|gif);base64,(.*?)"/gi;
export const redirectUriPort = 3010;
export const redirectUri = `http://localhost:${redirectUriPort}/oauth/callback`;

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

export const isMacOS = platform() === 'darwin';

/**
 * Locate a binary on macOS.
 * @param bundleId
 */
export const locateBinaryMacOS = async (bundleId: string) => new Promise<string>((resolve, reject) => {
  if (!isMacOS) {
    return reject(new Error('Platform is not macOS'));
  }

  exec(`mdfind kMDItemCFBundleIdentifier=${bundleId}`, (error, stdout) => {
    if (error) {
      return reject(error);
    }

    return resolve(stdout.trim());
  });
});

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
    .replace(filenameReservedRegExp, reservedCharReplacement)
    .replace(windowsNamesReservedRegExp, reservedCharReplacement);
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
    const updatedContents = outputContents.replace(base64BitMapRegExp, (matchString, imageFormat, base64data) => {
      return matchString.replace(
        base64data,
        adjustImageGamma(base64data, imageFormat),
      );
    });

    await writeFile(outputEntry.path, updatedContents);
  }
};
