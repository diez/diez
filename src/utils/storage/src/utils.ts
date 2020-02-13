import {copySync, ensureDirSync, readFileSync, readlinkSync, symlinkSync, writeFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {isBinarySync} from 'istextorbinary';
import klaw from 'klaw';
import nodeFetch from 'node-fetch';
import {platform, tmpdir} from 'os';
import {dirname, join, relative} from 'path';
import {v4} from 'uuid';

/**
 * Returns true iff we are on the Windows platform.
 * @ignore
 */
export const isWindows = () => platform() === 'win32';

/**
 * Templatizes an entire directory using [handlebars](https://handlebarsjs.com), then outputs the results to the
 * requested output root.
 *
 * Files and filenames are both parsed and rewritten based on replacement tokens.
 */
export const outputTemplatePackage = async (
  templateRoot: string,
  outputRoot: string,
  tokens: any,
  blacklist: Set<string> = new Set(),
) => new Promise<void>((resolve, reject) => klaw(templateRoot, {preserveSymlinks: true})
  .on('data', ({stats, path: sourcePath}) => {
    const relativeFilename = relative(templateRoot, sourcePath);
    if ((!stats.isFile() && !stats.isSymbolicLink()) || blacklist.has(relativeFilename)) {
      return;
    }

    let compiledRelativeFilename;

    if (isWindows()) {
      compiledRelativeFilename = compile(relativeFilename.replace(/\\/g, '\\\\'))(tokens);
    } else {
      compiledRelativeFilename = compile(relativeFilename)(tokens);
    }

    // Note: even the file and directory names can be tokenized.
    const outputPath = join(outputRoot, compiledRelativeFilename);
    ensureDirSync(dirname(outputPath));

    // Preserve symbolic links.
    if (stats.isSymbolicLink()) {
      symlinkSync(
        compile(readlinkSync(sourcePath))(tokens),
        outputPath,
      );
      return;
    }

    if (isBinarySync(sourcePath)) {
      copySync(sourcePath, outputPath);
      return;
    }

    writeFileSync(
      outputPath,
      compile(readFileSync(sourcePath).toString())(tokens),
      {
        mode: stats.mode,
      },
    );
  }).on('end', resolve).on('error', reject));

/**
 * Provides a unique temporary filename.
 */
export const getTempFileName = () => join(tmpdir(), v4());

/**
 * Downloads a file to a temporary location.
 */
export const downloadStream = async (url: string) => {
  const response = await nodeFetch(url);
  return response.body;
};
