import {Log} from '@diez/cli-core';
import enquirer from 'enquirer';
import {copy, existsSync} from 'fs-extra';
import {join} from 'path';
import {currentVersion, replaceOccurrencesInFile, root, run} from '../internal/helpers';

export = {
  name: 'create-package',
  description: 'Creates a new package in the monorepo.',
  loadAction: () => async () => {
    const templateLocation = join(root, 'templates', 'package');
    if (!existsSync(templateLocation)) {
      throw new Error(`Unable to location template project in ${templateLocation}. Aborting.`);
    }

    interface Answers {
      packageName: string;
    }

    const packageName = (await enquirer.prompt<Answers>({
      type: 'input',
      name: 'packageName',
      message: 'Enter package name (e.g. `foo` to create `@diez/foo`).',
    })).packageName;

    const destination = join(root, 'packages', packageName);
    Log.info(`Creating package @diez/${packageName} in ${destination}...`);
    await copy(templateLocation, destination);
    const replacements = new Map([
      ['REPLACEME', packageName],
      [packageName, currentVersion],
    ]);
    await replaceOccurrencesInFile(join(destination, 'README.md'), replacements);
    await replaceOccurrencesInFile(join(destination, 'package.json'), replacements);
    run('yarn lerna bootstrap');
  },
};
