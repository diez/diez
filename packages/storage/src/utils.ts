import {ensureDirSync, readFileSync, writeFileSync} from 'fs-extra';
import {walkSync} from 'fs-walk';
import {compile} from 'handlebars';
import {join, relative, resolve} from 'path';

/**
 * Templatizes an entire directory using [handlebars](https://handlebarsjs.com), then outputs the results to the
 * requested output root.
 *
 * Files and filenames are both parsed and rewritten based on replacement tokens.
 */
export const outputTemplatePackage = (templateRoot: string, outputRoot: string, tokens: any) => {
  walkSync(templateRoot, (basedir, filename, stats) => {
    if (!stats.isFile()) {
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
