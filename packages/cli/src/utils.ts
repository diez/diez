import {each} from 'async';
import {exec as coreExec, ExecException, ExecOptions} from 'child_process';
import {existsSync, readJsonSync} from 'fs-extra';
import {platform} from 'os';
import {AbbreviatedVersion as PackageJson} from 'package-json';
import {join} from 'path';
import {DiezConfiguration} from './api';

// tslint:disable-next-line:no-var-requires
const packageJson = require(join('..', 'package.json'));

/**
 * The development dependencies of this package.
 */
export const devDependencies: {[key: string]: string} = packageJson.devDependencies;

/**
 * The version of this package. Used for synchronizing Diez versions.
 */
export const diezVersion: string = packageJson.version;

/**
 * Cache for found plugins.
 *
 * @internal
 */
const plugins = new Map<string, DiezConfiguration>();

/**
 * A Promise-wrapped child_process.exec.
 * @param command - The command to run, with space-separated arguments.
 * @param options - The child_process.exec options.
 */
export const execAsync = (command: string, options?: ExecOptions) => new Promise<string>(
  (resolve, reject) => {
    coreExec(command, options, (error: ExecException | null, stdout: string | Buffer) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(stdout.toString().trim());
    });
  },
);

/**
 * Returns true iff we are on the macOS platform.
 */
export const isMacOS = () => platform() === 'darwin';

/**
 * Recursively resolve dependencies for a given package name.
 *
 * @internal
 */
const getDependencies = (
  packageName: string,
  foundPackages: Map<string, {json: PackageJson, path: string}>,
  isRootPackage = false,
): void => {
  if (foundPackages.has(packageName)) {
    return;
  }

  // FIXME: we shouldn't necessarily require `lib/` in the main package path.
  const packagePath = isRootPackage ? packageName : require.resolve(packageName).split('lib')[0];
  const json = readJsonSync(join(packagePath, 'package.json'), {throws: false});
  if (!json) {
    return;
  }

  foundPackages.set(isRootPackage ? '.' : packageName, {json, path: packagePath});

  if (json.dependencies) {
    for (const name in json.dependencies) {
      try {
        getDependencies(name, foundPackages);
      } catch (_) {}
    }
  }

  if (isRootPackage && json.devDependencies) {
    for (const name in json.devDependencies) {
      try {
        getDependencies(name, foundPackages);
      } catch (_) {}
    }
  }
};

/**
 * Loops through all dependencies to locate Diez plugins, and returns a map of module names to Diez plugin
 * configurations.
 */
export const findPlugins = (rootPackageName = global.process.cwd()): Promise<Map<string, DiezConfiguration>> => {
  // Use our cache if it's populated.
  if (plugins.size) {
    return Promise.resolve(plugins);
  }

  const foundPackages = new Map<string, {json: PackageJson, path: string}>();
  getDependencies(rootPackageName, foundPackages, true);

  return new Promise((resolve) => {
    each<[string, {json: PackageJson, path: string}]>(
      Array.from(foundPackages),
      ([packageName, {json, path}], next) => {
        const configuration = (json.diez || {}) as DiezConfiguration;
        const diezRcPath = join(path, '.diezrc');
        if (existsSync(diezRcPath)) {
          // TODO: support alternative formats (e.g. YAML) here.
          const rcConfiguration = readJsonSync(diezRcPath, {throws: false});
          if (rcConfiguration) {
            Object.assign(configuration, rcConfiguration);
          }
        }

        if (Object.keys(configuration).length) {
          plugins.set(packageName, configuration);
        }

        return next();
      },
      () => {
        resolve(plugins);
      },
    );
  });
};

/**
 * Wrapped require to support CLI plugin infrastructure.
 */
export const cliRequire = <T = any>(plugin: string, path: string): T => {
  if (plugin === '.') {
    return require(join(global.process.cwd(), path));
  }

  return require(join(plugin, path));
};
