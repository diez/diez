import {eachSeries} from 'async';
import {exec} from 'child_process';
import {emptyDir, mkdirp, readFile, writeFile} from 'fs-extra';
import {createServer} from 'http';
import klawSync from 'klaw-sync';
import opn = require('opn');
import {platform, tmpdir} from 'os';
import {extname, join} from 'path';
import {PNG} from 'pngjs';
import serverDestroy = require('server-destroy');
import {URL} from 'url';
import {v4} from 'uuid';

const reservedCharReplacement = '-';
const filenameReservedRegExp = /[<>:"\/\\|?*\x00-\x1F]/g;
const windowsNamesReservedRegExp = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
const base64BitMapRegExp = /"data:image\/(png|jpe?g|gif);base64,(.*?)"/gi;
const ports = [46572, 48735, 7826, 44495, 21902];

export interface FileObject {
  fullPath: string;
  content: string;
  name: string;
}

export type FolderGroup = Map<string|number, string>;

export const enum ImageFormats {
  png = 'png',
  svg = 'svg',
  jpg = 'jpg',
}

export const isMacOS = platform() === 'darwin';

/**
 * Find an open port.
 */
export const findOpenPort = async (): Promise<number> => {
  const server = createServer();
  return new Promise((resolve, reject) => {
    eachSeries<number, boolean>(ports, (port, next) => {
      try {
        server.listen(port, '0.0.0.0');
        server.once('listening', () => {
          server.once('close', () => {
            resolve(port);
            return next(true);
          });
          server.close();
        });

        server.on('error', (err?: {code: string}) => {
          if (err && err.code === 'EADDRINUSE') {
            // This port is taken; try the next one.
            return next();
          }
        });
      } catch (error) {
        return next();
      }
    }, (success) => {
      if (!success) {
        reject(new Error('Unable to find open port.'));
      }
    });
  });
};

export interface OAuthCode {
  code: string;
  state: string;
}

/**
 * Requests an OAuth 2.0 code using the default web browser, starts a mini-web server for handling the redirect,
 * and redirects to a success page after completion.
 * @param authUrl The pre-built authentication URL where we can request a code.
 * @param port The (open) port number where we should start listening for tokens.
 */
export const getOAuthCodeFromBrowser = (authUrl: string, port: number): Promise<OAuthCode> => {
  return new Promise((resolve, reject) => {
    const server = createServer(async (request, response) => {
      try {
        if (request) {
          const {searchParams: qs} = new URL(request.url!, `http:localhost:${port}`);
          resolve({code: qs.get('code')!, state: qs.get('state')!});
          // TODO: improve the redirect location of this handshake.
          response.writeHead(302, {
            Location: 'https://www.haiku.ai/',
          });
          response.end();
          server.destroy();
          // TODO: take users back to Terminal (if possible) on other platforms.
          if (isMacOS) {
            exec('open -b com.apple.Terminal');
          }
        }
      } catch (error) {
        reject(error);
      }
    }).listen(port, async () => {
      const cp = await opn(authUrl, {wait: false});
      cp.unref();
    });

    serverDestroy(server);
  });
};

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
export const adjustImageGamma = (base64data: string, imageFormat: ImageFormats) => {
  if (imageFormat === ImageFormats.png && typeof base64data === 'string' && base64data.length) {
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
    if (extname(outputEntry.path) !== `.${ImageFormats.svg}`) {
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
