import {exec, ExecOptions, execSync, ExecSyncOptions, spawn, SpawnOptions, spawnSync} from 'child_process';
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
    childOutput = spawnSync('npm', ['config', 'list'], {cwd: root}).output.join('');
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
    execBinary: 'npx',
  },
  [PackageManagers.Yarn]: {
    addDependency: 'add',
    installAllDependencies: 'install',
    execBinary: 'yarn',
  },
};

/**
 * Abstraction around the logic to manage node package-manager related tasks such as installing, removing packages, etc.
 */
export class PackageManager {
  constructor (readonly binary: PackageManagers) {
  }

  get commands () {
    return commands[this.binary];
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
  installAllDependencies (options?: ExecOptions) {
    return new Promise((resolve, reject) => {
      exec(`${this.binary} ${this.commands.installAllDependencies}`, options, (error) => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }

  /**
   * Executes a custom command with the current package manager.
   */
  exec (args: string[], options: SpawnOptions = {}) {
    const task = spawn(this.binary, args, options);

    return new Promise((resolve, reject) => {
      task.on('close', () => {
        resolve();
      });

      task.on('error', (error) => {
        reject(error);
      });
    });
  }

  execBinary (command: string, options?: ExecSyncOptions) {
    execSync(`${this.commands.execBinary} ${command}`, options);
  }
}

let packageManager: PackageManager;

/**
 * Returns a cached package manager instance with the binary set according depending on the availability of npm/yarn.
 */
export const getPackageManager = async () => {
  if (packageManager) {
    return packageManager;
  }

  const binary = await shouldUseYarn() ? PackageManagers.Yarn : PackageManagers.Npm;

  if (binary === PackageManagers.Npm && !await canUseNpm(process.cwd())) {
    throw new Error('Unable to start an NPM process.');
  }

  packageManager = new PackageManager(binary);
  return packageManager;
};
