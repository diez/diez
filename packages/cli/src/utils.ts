/* tslint:disable no-var-requires */
import {each} from 'async';
import {readdir, stat} from 'fs';
import {join} from 'path';

const namespace = '@livedesigner';

export const findPluginsWithPrefix = (prefix: string): Promise<Set<string>> => {
  const plugins = new Set<string>();

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
              if (file.startsWith(`${prefix}-`)) {
                plugins.add(`${namespace}/${file}`);
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
