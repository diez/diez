/* tslint:disable:max-line-length */
import chalk from 'chalk';
import glob from 'glob';
import {basename, join, resolve} from 'path';
import {root, run} from '../internal/helpers';

interface Flags {
  target: 'ios' | 'android' | 'web';
}

const buildAndroid = () => {
  glob(join(root, 'examples', '*', 'android'), (_, matches) => {
    for (const androidRoot of matches) {
      const diezRoot = resolve(androidRoot, '..');
      console.log(chalk.blue(`Building for Android: ${basename(diezRoot)}`));
      run('yarn diez-cli compile -t android -o android', diezRoot);
      run('./gradlew build', androidRoot);
    }
  });
};

const buildIos = () => {
  glob(join(root, 'examples', '*', 'ios', '*.xcworkspace'), (_, matches) => {
    for (const iosWorkspace of matches) {
      const iosRoot = resolve(iosWorkspace, '..');
      const diezRoot = resolve(iosRoot, '..');
      console.log(chalk.blue(`Building for iOS: ${basename(diezRoot)}`));
      run('yarn diez-cli compile -t ios -o ios', diezRoot);
      run('pod install', iosRoot);
      run(`xcodebuild -workspace ${basename(iosWorkspace)} -scheme ${basename(iosWorkspace, '.xcworkspace')} -sdk iphonesimulator | xcpretty -t; test \${PIPESTATUS[0]} -eq 0`, iosRoot);
    }
  });
};

const buildWeb = () => {
  glob(join(root, 'examples', '*', 'web'), (_, matches) => {
    for (const webRoot of matches) {
      const diezRoot = resolve(webRoot, '..');
      console.log(chalk.blue(`Building for web: ${basename(diezRoot)}`));
      run('yarn diez-cli compile -t web -o web --baseUrl /diez --staticRoot web/public/diez', diezRoot);
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
      console.log(chalk.red('--target is required.'));
      process.exit(1);
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
