/* tslint:disable:max-line-length */
import {Log} from '@diez/cli-core';
import {existsSync} from 'fs-extra';
import glob from 'glob';
import {basename, join, resolve} from 'path';
import {root, run} from '../internal/helpers';

interface Flags {
  target: 'ios' | 'android' | 'web';
}

const buildAndroid = () => {
  glob(join(root, 'examples', '*', 'examples', '{android,android-java}'), (_, matches) => {
    for (const androidRoot of matches) {
      const diezRoot = resolve(androidRoot, '..');
      Log.info(`Building for Android: ${basename(diezRoot)}`);
      run('yarn diez compile -t android', diezRoot);
      run('./gradlew build', androidRoot);
    }
  });
};

const buildIos = () => {
  glob(join(root, 'examples', '*'), (_, matches) => {
    for (const diezRoot of matches) {
      Log.info(`Building for iOS: ${basename(diezRoot)}`);
      const scriptPath = join('scripts', 'build-ios-ci.sh');
      const script = existsSync(join(diezRoot, scriptPath));
      if (!script) {
        Log.info(`Skipping ${basename(diezRoot)} because no build-ios-ci script was provided.`);
        continue;
      }
      run(`./${scriptPath}`, diezRoot);
    }
  });
};

const buildWeb = () => {
  glob(join(root, 'examples', '*', 'examples', 'web'), (_, matches) => {
    for (const webRoot of matches) {
      const diezRoot = resolve(webRoot, '..');
      Log.info(`Building for web: ${basename(diezRoot)}`);
      run('yarn diez compile -t web --js', diezRoot);
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
  loadAction: () => async ({target}: Flags) => {
    if (!target) {
      throw new Error('--target is required.');
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
