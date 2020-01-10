import {diezVersion, Log, execAsync} from '@diez/cli-core';
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
import {copy, ensureDirSync, existsSync, readFileSync, readlinkSync, removeSync, symlinkSync, writeFileSync} from 'fs-extra';
import {isBinarySync} from 'istextorbinary';
import klaw from 'klaw';
import {dirname, join, relative} from 'path';
import {c} from 'tar';
import {replaceOccurrencesInString, root, run, runQuiet} from '../internal/helpers';

const exampleProject = 'lorem-ipsum';

const uploadTemplateExamples = async (containingDirectory: string, effectiveVersion: string) => {
  const archiveName = 'project.tgz';
  await c(
    {
      cwd: containingDirectory,
      gzip: true,
      file: join(containingDirectory, archiveName),
    },
    ['{{nameKebabCase}}'],
  );

  run(
    `aws s3 cp ${archiveName} s3://diez-examples/${effectiveVersion}/createproject/${archiveName}`,
    containingDirectory,
  );
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

const removeUnwantedFiles = (directory: string) => {
  removeSync(join(directory, exampleProject, 'design-language', 'scripts'));
  removeSync(join(directory, exampleProject, 'design-language', 'CHANGELOG.md'));
  removeSync(join(directory, exampleProject, 'design-language', 'designs', 'LoremIpsum.sketch'));
};

const removeGitIgnoredFiles = (directory: string) => {
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
  description: 'Extracts a templatized diez create project from the lorem-ipsum example.',
  loadAction: () => async ({currentVersion}: ExtractLoremIpsumOptions) => {
    const effectiveVersion = currentVersion || diezVersion;
    const loremIpsumRoot = join(root, 'examples', exampleProject);
    if (!existsSync(loremIpsumRoot)) {
      throw new Error(`Unable to locate source project at ${loremIpsumRoot}. Aborting.`);
    }

    const swapDestination = getTempFileName();
    const archiveDestination = getTempFileName();
    ensureDirSync(swapDestination);

    Log.info('Building web SDK to preserve symlink...');
    await execAsync('diez compile -t web', {cwd: join(loremIpsumRoot, 'design-language')});

    Log.info(`Generating template using ${loremIpsumRoot} to ${archiveDestination} via ${swapDestination}...`);
    await copy(loremIpsumRoot, join(swapDestination, exampleProject));
    removeUnwantedFiles(swapDestination);
    removeGitIgnoredFiles(swapDestination);

    const replacements = new Map([
      ['{{', '{{{openTag}}}'],
      ['}}', '{{{closeTag}}}'],
    ]);
    populateTemplateMapForCasedName(exampleProject, replacements);

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
        let contents = isBinarySync(originalQualifiedFilename, originalContents) ?
          originalContents :
          replaceOccurrencesInString(originalContents.toString(), replacements);

        if (originalRelativeFilename.includes('package.json')) {
          contents = contents.toString()
            .replace(/"version": "*.*"/g, '"version": "0.1.0"')
            .replace('link', '{{designSystemLinkingProtocol}}');
        }

        writeFileSync(qualifiedFilename, contents, {mode: stats.mode});
      }).on('end', resolve));

    await uploadTemplateExamples(archiveDestination, effectiveVersion);

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
