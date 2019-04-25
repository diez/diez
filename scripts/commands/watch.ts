import {fork} from 'child_process';
import {ensureFileSync, removeSync} from 'fs-extra';
import {assertNotWatching, watchMutex} from '../internal/helpers';

export = {
  name: 'watch',
  description: 'Watches TypeScript sources in the monorepo and automatically compiles changes.',
  action: async () => {
    assertNotWatching();
    const watchProcess = fork('./node_modules/.bin/lerna', ['run', 'watch', '--parallel'], {stdio: 'inherit'});
    watchProcess.on('exit', () => {
      removeSync(watchMutex);
      process.exit(0);
    });

    const cleanup = () => {
      removeSync(watchMutex);
      watchProcess.kill();
    };

    global.process.on('exit', cleanup);
    global.process.on('SIGINT', cleanup);
    global.process.on('SIGHUP', cleanup);
    global.process.on('SIGQUIT', cleanup);
    global.process.on('SIGTSTP', cleanup);

    ensureFileSync(watchMutex);
  },
};
