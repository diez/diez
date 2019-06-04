import {exitTrap} from '@diez/cli-core';
import {fork} from 'child_process';
import {ensureFileSync, removeSync} from 'fs-extra';
import {assertNotWatching, watchMutex} from '../internal/helpers';

export = {
  name: 'watch',
  description: 'Watches TypeScript sources in the monorepo and automatically compiles changes.',
  loadAction: () => async () => {
    assertNotWatching();
    const watchProcess = fork('./node_modules/.bin/lerna', ['run', 'watch', '--parallel'], {stdio: 'inherit'});
    watchProcess.on('exit', () => {
      removeSync(watchMutex);
      process.exit(0);
    });

    exitTrap(() => {
      removeSync(watchMutex);
      watchProcess.kill();
    });

    ensureFileSync(watchMutex);
  },
};
