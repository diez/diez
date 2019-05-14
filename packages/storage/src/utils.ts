import {ensureDirSync, readFileSync, writeFileSync} from 'fs-extra';
import {walkSync} from 'fs-walk';
import {compile} from 'handlebars';
import nodeFetch from 'node-fetch';
import {tmpdir} from 'os';
import {join, relative, resolve} from 'path';
import {v4} from 'uuid';

/**
 * Templatizes an entire directory using [handlebars](https://handlebarsjs.com), then outputs the results to the
 * requested output root.
 *
 * Files and filenames are both parsed and rewritten based on replacement tokens.
 */
export const outputTemplatePackage = (
  templateRoot: string,
  outputRoot: string,
  tokens: any,
  blacklist: Set<string> = new Set(),
) => {
  walkSync(templateRoot, (basedir, filename, stats) => {
    if (!stats.isFile() || blacklist.has(filename)) {
      return;
    }

    // Note: even the file and directory names can be tokenized.
    const outputFilename = compile(filename)(tokens);
    const outputDirectory = compile(resolve(outputRoot, relative(templateRoot, basedir)))(tokens);

    ensureDirSync(outputDirectory);
    writeFileSync(
      join(outputDirectory, outputFilename),
      compile(readFileSync(resolve(basedir, filename)).toString())(tokens),
    );
  });
};

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
