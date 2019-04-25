import {readJson, remove} from 'fs-extra';
import glob from 'glob';
import {join} from 'path';
import {assertNotWatching, root, run} from '../internal/helpers';

const packageFilesToDelete = [
  'lib',
  'types',
  'tsconfig.tsbuildinfo',
  'yarn-error.log',
  'test-result.tap',
  'cobertura-coverage.xml',
  'checkstyle-result.xml',
  '.DS_Store',
];

/**
 * Cleans packages.
 */
export const clean = async () => {
  assertNotWatching();
  const config = await readJson(join(root, 'lerna.json'));
  for (const workspace of config.packages) {
    // Intentionally adding a `/` to the workspace path to tell `glob`
    // that we only want to match directories
    const matches = glob.sync(`${workspace}/`, {root});
    for (const match of matches) {
      for (const fileToDelete of packageFilesToDelete) {
        await remove(join(match, fileToDelete));
      }
    }
  }

  // Clean the stub project used in unit tests.
  await remove(join(root, 'examples', 'stub'));

  // Run `yarn` to sync dependencies and recompile everything.
  run('yarn');
};
