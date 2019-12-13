import {each} from 'async';
import {ChildProcess, exec as coreExec, ExecException, ExecOptions, spawn} from 'child_process';
import {existsSync, readFileSync} from 'fs-extra';
import {platform} from 'os';
import {AbbreviatedVersion as PackageJson} from 'package-json';
import {dirname, join} from 'path';
import {DiezConfiguration, PagerOptions} from './api';
import {Log} from './reporting';

// tslint:disable-next-line:no-var-requires
const packageJson = require(join('..', 'package.json'));

/**
 * The development dependencies of this package.
 * @ignore
 */
export const devDependencies: {[key: string]: string} = packageJson.devDependencies;

/**
 * The version of this package. Used for synchronizing Diez versions.
 * @ignore
 */
export const diezVersion: string = packageJson.version;

/**
 * Cache for found plugins.
 */
const plugins = new Map<string, DiezConfiguration>();

/**
 * A Promise-wrapped `child_process.exec`.
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
 * @ignore
 */
export const isMacOS = () => platform() === 'darwin';

/**
 * Returns true iff we are on the Windows platform.
 * @ignore
 */
export const isWindows = () => platform() === 'win32';

/**
 * @internal
 */
const getPackageJsonPath = (packageName: string) => {
  try {
    return require.resolve(join(packageName, 'package.json'));
  } catch (_) {
    // istanbul ignore next
    return undefined;
  }
};

/**
 * Recursively resolve dependencies for a given package name.
 */
const getDependencies = (
  packageName: string,
  foundPackages: Map<string, {json: PackageJson, path: string}>,
  isRootPackage = false,
): void => {
  // istanbul ignore if
  if (foundPackages.has(packageName)) {
    return;
  }

  const packageJsonPath = getPackageJsonPath(packageName);
  // istanbul ignore if
  if (!packageJsonPath) {
    return;
  }

  const packagePath = dirname(packageJsonPath);
  const json = require(packageJsonPath);

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
 * Loops through all dependencies to locate Diez plugins, and returns a map of module names to [[DiezConfiguration]]s.
 */
export const findPlugins = (
  rootPackageName = global.process.cwd(),
  bootstrapRoot?: string,
): Promise<Map<string, DiezConfiguration>> => {
  // Use our cache if it's populated.
  if (plugins.size) {
    return Promise.resolve(plugins);
  }

  const foundPackages = new Map<string, {json: PackageJson, path: string}>();
  getDependencies(rootPackageName, foundPackages, true);
  if (bootstrapRoot) {
    getDependencies(bootstrapRoot, foundPackages);
  }

  return new Promise((resolve) => {
    each<[string, {json: PackageJson, path: string}]>(
      Array.from(foundPackages),
      ([packageName, {json, path}], next) => {
        const configuration = (json.diez || {}) as DiezConfiguration;
        const diezRcPath = join(path, '.diezrc');
        if (!existsSync(diezRcPath)) {
          return next();
        }

        try {
          const rcConfiguration = JSON.parse(readFileSync(diezRcPath).toString());
          Object.assign(configuration, rcConfiguration);
        } catch (error) {
          Log.warning(`Found invalid .diezrc at ${diezRcPath}`);
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
 * @ignore
 */
export const cliRequire = <T>(plugin: string, path: string): T => {
  if (plugin === '.') {
    return require(join(global.process.cwd(), path));
  }

  return require(join(plugin, path));
};

/**
 * Provides an async check for whether we can run a command from the command line.
 *
 * Resolves `true` iff the command both runs and produces output.
 */
export const canRunCommand = async (command: string) => {
  try {
    return !!(await execAsync(command));
  } catch (_) {
    return false;
  }
};

/**
 * Locate a binary on macOS.
 */
export const locateBinaryMacOS = async (bundleId: string) => {
  if (!isMacOS()) {
    throw new Error('Platform is not macOS');
  }

  const result = await execAsync(`mdfind kMDItemCFBundleIdentifier=${bundleId}`);
  if (!result) {
    return undefined;
  }

  return result.split('\n')[0];
};

/**
 * Exit trap for shutting down handles and preventing process leaks in Node.
 */
export const exitTrap = (cleanup: () => void) => {
  global.process.once('exit', cleanup);
  global.process.once('SIGINT', cleanup);
  global.process.once('SIGHUP', cleanup);
  global.process.once('SIGQUIT', cleanup);
  global.process.once('SIGTSTP', cleanup);
};

/**
 * Checks if an argument is a ChildProcess
 */
export const isChildProcess = (proc: void | ChildProcess | Buffer): proc is ChildProcess => {
  return Boolean(proc) && (proc as ChildProcess).kill !== undefined;
};

/**
 * Encodes a package name to be safely transmitted via HTTP requests.
 */
export const encodePackageName = (name: string) => {
  return name.replace('/', '+');
};

/**
 * Decodes a package name transmitted via HTTP requests.
 */
export const decodePackageName = (name: string) => {
  return name.replace('+', '/');
};

/**
 * Page an input source using sensible pager applications per-platform.
 */
export const pager = (options: PagerOptions) => {
  return new Promise<{code: number | null, signal: string | null}>((resolve, reject) => {
    const command = isWindows() ? 'powershell' : 'sh';
    const paging =  isWindows() ? `cat ${options.source} | Out-Host -Paging` : `cat ${options.source} | less`;

    setProcessStdinRaw(true);
    const ps = spawn(command, ['-c', paging], {stdio : [null, 1, 2]});

    ps.on('exit', (code, signal) => {
      setProcessStdinRaw(false);
      process.stdin.pause();
      resolve({code, signal});
    });

    if (ps.stdin) {
      ps.stdin.on('error', (error) => {
        // Ignore EPIPE and ECONNRESET.
      });
    }
  });
};

const setProcessStdinRaw = (mode: boolean) => {
  if (process.stdin.setRawMode) {
    process.stdin.setRawMode(mode);
  }
};
