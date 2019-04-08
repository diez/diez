import {ensureDirSync, readFileSync, writeFileSync} from 'fs-extra';
import {walkSync} from 'fs-walk';
import {compile} from 'handlebars';
import {join, relative, resolve} from 'path';

/**
 * Templatizes an entire directory using handlebars, then outputs
 * @param templateRoot - The root in which we should start
 * @param outputRoot
 * @param tokens
 */
export const outputTemplatePackage = (templateRoot: string, outputRoot: string, tokens: any) => {
  walkSync(templateRoot, (basedir, filename, stats) => {
    if (!stats.isFile()) {
      return;
    }

    const outputDirectory = resolve(outputRoot, relative(templateRoot, basedir));
    ensureDirSync(outputDirectory);
    writeFileSync(
      join(outputDirectory, filename),
      compile(readFileSync(resolve(basedir, filename)).toString())(tokens),
    );
  });
};
