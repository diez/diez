/* tslint:disable no-var-requires */
import {each} from 'async';
import {readdir, stat} from 'fs';
import {join} from 'path';
import {CliAction, CliCommandProvider, CliConfiguration} from './api';

const packageJson = require(join('..', 'package.json'));

export const devDependencies: {[key: string]: string} = packageJson.devDependencies;

export const diezVersion: string = packageJson.version;

const namespace = '@livedesigner';

const plugins = new Map<string, CliConfiguration>();
// tslint:disable-next-line: no-var-requires
const Module = require('module');
let foundPlugins = false;

export const findPlugins = (): Promise<Map<string, CliConfiguration>> => {
  if (foundPlugins) {
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
        foundPlugins = true;
      },
    );
  });
};

/**
 * A CliCommandProvider factory.
 * @param command
 * @param description
 * @param action
 */
export const provideCommand = (command: string, description: string, action: CliAction): CliCommandProvider => (
  {command, description, action});
