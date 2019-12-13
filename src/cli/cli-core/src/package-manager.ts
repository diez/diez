import {spawn, SpawnOptions, spawnSync} from 'child_process';
import {PackageManagerCommands, PackageManagers} from './api';
import {canRunCommand} from './utils';

/**
 * Provides an async check for if we are equipped to use `yarn` for package management operations.
 * @internal
 */
export const shouldUseYarn = () => canRunCommand('yarnpkg --version');

/**
 * Provides an async check for if we are equipped to use `npm` in the current root as fallback for package management
 * operations.
 *
 * @see {@link https://bit.ly/2rEVJtD}.
 * @ignore
 */
export const canUseNpm = async (root: string) => {
  let childOutput = null;
  try {
    // Note: intentionally using `spawn` over `exec` since
    // some scenarios doesn't reproduce otherwise.
    // `npm config list` is the only reliable way I could find
    // to reproduce the wrong path. Just printing process.cwd()
    // in a Node process was not enough.
    childOutput = spawnSync('npm', ['config', 'list']).output.join('');
  } catch (_) {
    // Something went wrong spawning node.
    // Not great, but it means we can't do this check.
    return true;
  }
  if (typeof childOutput !== 'string') {
    return true;
  }

  // `npm config list` output includes the following line:
  // "; cwd = C:\path\to\current\dir" (unquoted)
  const matches = childOutput.match(/^; cwd = (.*)$/m);
  if (matches === null) {
    // Fail gracefully. They could remove it.
    return true;
  }

  return matches[1] === root;
};

const commands: PackageManagerCommands = {
  [PackageManagers.Npm]: {
    add: 'install',
    install: 'install',
  },
  [PackageManagers.Yarn]: {
    add: 'add',
    install: 'install',
  },
};

class PackageManager {
  readonly bin = shouldUseYarn() ? PackageManagers.Yarn : PackageManagers.Npm;

  constructor () {
    this.validate();
  }

  private async validate () {
    if (this.bin === PackageManagers.Npm && !await canUseNpm(process.cwd())) {
      throw new Error('Unable to start an NPM process.');
    }
  }

  add (packages: string, options?: SpawnOptions) {
    return this.exec([commands[this.bin].add, packages], options).promise;
  }

  install (options?: SpawnOptions) {
    return this.exec([commands[this.bin].install], options).promise;
  }

  exec (args: string[], options: SpawnOptions = {}) {
    const task = spawn(this.bin, args, options);
    const promise = new Promise((resolve, reject) => {
      task.on('close', () => {
        resolve();
      });

      task.on('error', (error) => {
        reject(error);
      });
    });

    return {task, promise};
  }
}

/**
 * Abstraction to manage complexities around node package managers.
 */
export const packageManager = new PackageManager();
