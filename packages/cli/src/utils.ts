import {DiezConfiguration} from '@livedesigner/engine';
import {each} from 'async';
import {exec as coreExec, ExecException, ExecOptions} from 'child_process';
import {readdir, stat} from 'fs';
import { platform } from 'os';
import {join} from 'path';

// tslint:disable-next-line:no-var-requires
const packageJson = require(join('..', 'package.json'));

export const devDependencies: {[key: string]: string} = packageJson.devDependencies;

export const diezVersion: string = packageJson.version;

const namespace = '@livedesigner';

// tslint:disable-next-line:no-var-requires variable-name
const Module = require('module');

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
 * @param stdio
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
 * Loops through all namespaced dependencies to locate Diez plugins, and returns a map of module names to Diez plugin
 * configurations.
 */
export const findPlugins = (): Promise<Map<string, DiezConfiguration>> => {
  // Use our cache if it's populated.
  if (plugins.size) {
    return Promise.resolve(plugins);
  }

  return new Promise((resolve) => {
    each<string>(
      Module._nodeModulePaths(__dirname),
      (nodeModulesPath, next) => {
        const path = join(nodeModulesPath, namespace);
        stat(path, (statError, stats) => {
          if (statError || !stats.isDirectory()) {
            return next();
          }

          readdir(path, (readdirError, files) => {
            if (readdirError) {
              return next();
            }

            for (const file of files) {
              try {
                const packageName = `${namespace}/${file}`;
                const packageSpec = require(join(packageName, 'package.json'));
                if (packageSpec && packageSpec.diez) {
                  plugins.set(packageName, packageSpec.diez);
                }
              } catch (error) {
                // Noop.
              }
            }

            return next();
          });
        });
      },
      () => {
        resolve(plugins);
      },
    );
  });
};
