import {diezVersion, info} from '@diez/cli-core';
import {getTempFileName} from '@diez/storage';
import {
  camelCase,
  constantCase,
  dotCase,
  headerCase,
  kebabCase,
  lowerCase,
  noCase,
  pascalCase,
  snakeCase,
  titleCase,
} from 'change-case';
import {copy, ensureDirSync, existsSync, readdirSync, readFileSync, readlinkSync, removeSync, symlinkSync, writeFileSync} from 'fs-extra';
import klaw from 'klaw';
import {isBinarySync} from 'istextorbinary';
import {dirname, join, relative} from 'path';
import {c} from 'tar';
import {replaceOccurrencesInString, root, run, runQuiet} from '../internal/helpers';

const uploadTargetExamples = async (containingDirectory: string, effectiveVersion: string) => {
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
      `aws s3 cp ${archiveName} s3://diez-examples/${effectiveVersion}/createproject/examples/${archiveName}`,
      containingDirectory,
    );
  }
};

const populateTemplateMapForCasedName = (name: string, map: Map<string, string>) => {
  const pascalCased = pascalCase(name);
  const lowerCased = lowerCase(pascalCased);
  map.set(pascalCased, '{{namePascalCase}}');
  map.set(lowerCased, '{{nameLowerCase}}');
  map.set(kebabCase(name), '{{nameKebabCase}}');
  map.set(camelCase(name), '{{nameCamelCase}}');
  map.set(titleCase(name), '{{nameTitleCase}}');
  map.set(noCase(name), '{{nameNoCase}}');
  map.set(snakeCase(name), '{{nameSnakeCase}}');
  map.set(constantCase(name), '{{nameConstantCase}}');
  map.set(headerCase(name), '{{nameHeaderCase}}');
  map.set(dotCase(name), '{{nameDotCase}}');
};

const removeGitIgnoredFiles = async (directory: string) => {
  runQuiet('git init', directory);
  runQuiet('git add .', directory);
  runQuiet('git commit -m "Initial commit."', directory);
  runQuiet('git clean -xdf', directory);
  removeSync(join(directory, '.git'));
};

interface ExtractLoremIpsumOptions {
  currentVersion?: string;
}

export = {
  name: 'extract-lorem-ipsum',
  description: 'Extracts templatized target examples from the lorem-ipsum example.',
  loadAction: () => async ({currentVersion}: ExtractLoremIpsumOptions) => {
    const effectiveVersion = currentVersion || diezVersion;
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

    info(`Generating template using ${exampleLocation} to ${archiveDestination} via ${swapDestination}...`);
    await copy(exampleLocation, swapDestination);
    await removeGitIgnoredFiles(swapDestination);

    const replacements = new Map([
      ['{{', '{{{openTag}}}'],
      ['}}', '{{{closeTag}}}'],
    ]);
    populateTemplateMapForCasedName('lorem-ipsum', replacements);

    await new Promise((resolve) => klaw(swapDestination, {preserveSymlinks: true})
      .on('data', ({path: originalQualifiedFilename, stats}) => {
        if (!stats.isFile() && !stats.isSymbolicLink()) {
          return;
        }

        const originalRelativeFilename = relative(swapDestination, originalQualifiedFilename);
        const relativeFilename = replaceOccurrencesInString(originalRelativeFilename, replacements);
        const qualifiedFilename = join(archiveDestination, relativeFilename);
        ensureDirSync(dirname(qualifiedFilename));

        // Preserve symbolic links.
        if (stats.isSymbolicLink()) {
          symlinkSync(
            replaceOccurrencesInString(readlinkSync(originalQualifiedFilename), replacements),
            qualifiedFilename,
          );
          return;
        }

        const originalContents = readFileSync(originalQualifiedFilename);
        const contents = isBinarySync(originalQualifiedFilename, originalContents) ?
          originalContents :
          replaceOccurrencesInString(originalContents.toString(), replacements);
        writeFileSync(qualifiedFilename, contents);
      }).on('end', resolve));

    await uploadTargetExamples(archiveDestination, effectiveVersion);

    await c(
      {
        cwd: loremIpsumRoot,
        gzip: true,
        file: join(archiveDestination, 'assets.tgz'),
      },
      ['assets'],
    );

    run(
      `aws s3 cp assets.tgz s3://diez-examples/${effectiveVersion}/createproject/assets.tgz`,
      archiveDestination,
    );

    const distributionId = process.env.DIEZ_EXAMPLES_DISTRIBUTION;
    run(`aws cloudfront create-invalidation --distribution-id=${distributionId} --paths "/${effectiveVersion}/*"`);
  },
  options: [
    {
      longName: 'currentVersion',
      valueName: 'currentVersion',
    },
  ],
};
