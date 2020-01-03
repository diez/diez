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
    addDependency: 'install',
    installAllDependencies: 'install',
  },
  [PackageManagers.Yarn]: {
    addDependency: 'add',
    installAllDependencies: 'install',
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

  get commands () {
    return commands[this.bin];
  }

  /**
   * Adds a new dependency to a project.
   */
  addDependency (packages: string, options?: SpawnOptions) {
    return this.exec([this.commands.addDependency, packages], options);
  }

  /**
   * Installs all the dependencies listed in package.json.
   */
  installAllDependencies (options?: SpawnOptions) {
    return this.exec([this.commands.installAllDependencies], options);
  }

  /**
   * Executes a custom command with the current package manager.
   */
  exec (args: string[], options: SpawnOptions = {}) {
    const task = spawn(this.bin, args, options);

    return new Promise((resolve, reject) => {
      task.on('close', () => {
        resolve();
      });

      task.on('error', (error) => {
        reject(error);
      });
    });
  }
}

/**
 * Abstraction to manage complexities around node package managers.
 */
export const packageManager = new PackageManager();
