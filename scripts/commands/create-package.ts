import {fatalError} from '@diez/cli-core';
import chalk from 'chalk';
import enquirer from 'enquirer';
import {copy, existsSync} from 'fs-extra';
import {join} from 'path';
import {currentVersion, replaceInFile, root, run} from '../internal/helpers';

export = {
  name: 'create-package',
  description: 'Creates a new package in the monorepo.',
  action: async () => {
    const templateLocation = join(root, 'templates', 'package');
    if (!existsSync(templateLocation)) {
      fatalError(`Unable to location template project in ${templateLocation}. Aborting.`);
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
    console.log(chalk.blue(`Creating package @diez/${packageName} in ${destination}...`));
    await copy(templateLocation, destination);
    await replaceInFile(join(destination, 'README.md'), ['REPLACEME'], [packageName]);
    await replaceInFile(join(destination, 'package.json'), ['REPLACEME', 'VERSION'], [packageName, currentVersion]);
    run('yarn lerna bootstrap');
  },
};
