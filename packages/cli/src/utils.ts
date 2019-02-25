/* tslint:disable no-var-requires */
import {each} from 'async';
import {readdir, stat} from 'fs';
import {join} from 'path';
import {CliAction, CliCommandProvider, CliConfiguration} from './api';

const namespace = '@livedesigner';

const plugins = new Map<string, CliConfiguration>();
let foundPlugins = false;

export const findPlugins = (): Promise<Map<string, CliConfiguration>> => {
  if (foundPlugins) {
    return Promise.resolve(plugins);
  }

  return new Promise((resolve) => {
    each<string>(
      module.paths,
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
                const packageJson = require(join(packageName, 'package.json'));
                if (packageJson && packageJson.diez) {
                  plugins.set(packageName, packageJson.diez);
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
