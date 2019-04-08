import {DiezConfiguration} from '@livedesigner/engine';
import {each} from 'async';
import {readdir, stat} from 'fs';
import {join} from 'path';
import {CliAction, CliCommandProvider} from './api';

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
