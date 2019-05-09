/* tslint:disable:max-line-length */
import {fatalError} from '@diez/cli-core';
import chalk from 'chalk';
import {readJSONSync} from 'fs-extra';
import glob from 'glob';
import {basename, join, resolve} from 'path';
import {root, run} from '../internal/helpers';

interface Flags {
  target: 'ios' | 'android' | 'web';
}

const buildAndroid = () => {
  glob(join(root, 'examples', '*', '{android,android-java}'), (_, matches) => {
    for (const androidRoot of matches) {
      const diezRoot = resolve(androidRoot, '..');
      console.log(chalk.blue(`Building for Android: ${basename(diezRoot)}`));
      run('yarn diez compile -t android -o android', diezRoot);
      run('./gradlew build', androidRoot);
    }
  });
};

const buildIos = () => {
  glob(join(root, 'examples', '*'), (_, matches) => {
    for (const diezRoot of matches) {
      console.log(chalk.blue(`Building for iOS: ${basename(diezRoot)}`));
      const packageJson = readJSONSync(join(diezRoot, 'package.json'), {throws: false});
      if (!packageJson || !packageJson.scripts || !packageJson.scripts['build-ios-ci']) {
        console.log(chalk.blue(`Skipping ${basename(diezRoot)} because no build-ios-ci script was provided.`));
        continue;
      }
      run('yarn build-ios-ci', diezRoot);
    }
  });
};

const buildWeb = () => {
  glob(join(root, 'examples', '*', 'web'), (_, matches) => {
    for (const webRoot of matches) {
      const diezRoot = resolve(webRoot, '..');
      console.log(chalk.blue(`Building for web: ${basename(diezRoot)}`));
      run('yarn diez compile -t web -o web --baseUrl /diez --staticRoot web/public/diez', diezRoot);
      run('yarn', webRoot);
      run('yarn build', webRoot);
    }
  });
};

export = {
  name: 'build-examples',
  description: 'Builds example projects.',
  options: [{
    shortName: 't',
    longName: 'target',
    valueName: 'target',
    description: 'The name of the compiler target.',
  }],
  action: async ({target}: Flags) => {
    if (!target) {
      fatalError('--target is required.');
    }

    switch (target) {
      case 'android':
        buildAndroid();
        break;
      case 'ios':
        buildIos();
        break;
      case 'web':
        buildWeb();
        break;
      default:
        throw new Error(`Unknown target: ${target}`);
    }
  },
};
