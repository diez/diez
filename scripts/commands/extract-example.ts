import {diezVersion, info} from '@diez/cli-core';
import {getTempFileName} from '@diez/storage';
import changeCase from 'change-case';
import {copy, ensureDirSync, existsSync, readdirSync, readFileSync, removeSync, writeFileSync} from 'fs-extra';
import {walkSync} from 'fs-walk';
import {isBinarySync} from 'istextorbinary';
import {dirname, join, relative} from 'path';
import {c} from 'tar';
import {replaceOccurrencesInString, root, run, runQuiet} from '../internal/helpers';

const uploadTargetExamples = async (containingDirectory: string) => {
  for (const directory of readdirSync(containingDirectory)) {
    const archiveName = `${directory}.tgz`;
    await c(
      {
        cwd: containingDirectory,
        gzip: true,
        file: join(containingDirectory, archiveName),
      },
      [directory],
    );

    run(
      `aws s3 cp ${archiveName} s3://diez-examples/${diezVersion}/createproject/examples/${archiveName}`,
      containingDirectory,
    );
  }
};

const casedNameToTemplateMap = (name: string): Map<string, string> => {
  const pascalCase = changeCase.pascalCase(name);
  const lowerCase = changeCase.lowerCase(pascalCase);
  return new Map([
    [pascalCase, '{{namePascalCase}}'],
    [lowerCase, '{{nameLowerCase}}'],
    [changeCase.kebabCase(name), '{{nameKebabCase}}'],
    [changeCase.camelCase(name), '{{nameCamelCase}}'],
    [changeCase.titleCase(name), '{{nameTitleCase}}'],
    [changeCase.noCase(name), '{{nameNoCase}}'],
    [changeCase.snakeCase(name), '{{nameSnakeCase}}'],
    [changeCase.constantCase(name), '{{nameConstantCase}}'],
    [changeCase.headerCase(name), '{{nameHeaderCase}}'],
    [changeCase.dotCase(name), '{{nameDotCase}}'],
  ]);
};

const removeGitIgnoredFiles = async (directory: string) => {
  runQuiet('git init', directory);
  runQuiet('git add .', directory);
  runQuiet('git commit -m "Initial commit."', directory);
  runQuiet('git clean -xdf', directory);
  removeSync(join(directory, '.git'));
};

export = {
  name: 'extract-example',
  description: 'Extracts templatized target examples from the lorem-ipsum example.',
  loadAction: () => async () => {
    const loremIpsumRoot = join(root, 'examples', 'lorem-ipsum');
    const exampleLocation = join(loremIpsumRoot, 'examples');
    if (!existsSync(exampleLocation)) {
      throw new Error(`Unable to location source example project in ${exampleLocation}. Aborting.`);
    }

    const examplesGitDirectory = join(exampleLocation, '.git');
    if (existsSync(examplesGitDirectory)) {
      throw new Error(`${examplesGitDirectory} exists. Aborting.`);
    }

    const swapDestination = getTempFileName();
    const archiveDestination = getTempFileName();
    ensureDirSync(swapDestination);

    info(`Generating template using ${exampleLocation} to ${archiveDestination}...`);
    await copy(exampleLocation, swapDestination);

    await removeGitIgnoredFiles(swapDestination);

    const replacements = casedNameToTemplateMap('lorem-ipsum');

    walkSync(swapDestination, (basedir, originalFilename, stats) => {
      if (!stats.isFile()) {
        return;
      }

      const originalQualifiedFilename = join(basedir, originalFilename);
      const originalRelativeFilename = relative(swapDestination, originalQualifiedFilename);
      const relativeFilename = replaceOccurrencesInString(originalRelativeFilename, replacements);
      const qualifiedFilename = join(archiveDestination, relativeFilename);
      const originalContents = readFileSync(originalQualifiedFilename);
      const contents = isBinarySync(originalFilename, originalContents) ?
        originalContents :
        replaceOccurrencesInString(originalContents.toString(), replacements);
      ensureDirSync(dirname(qualifiedFilename));
      writeFileSync(qualifiedFilename, contents);
    });

    await uploadTargetExamples(archiveDestination);

    await c(
      {
        cwd: loremIpsumRoot,
        gzip: true,
        file: join(archiveDestination, 'assets.tgz'),
      },
      ['assets'],
    );

    run(
      `aws s3 cp assets.tgz s3://diez-examples/${diezVersion}/createproject/assets.tgz`,
      archiveDestination,
    );
  },
};
