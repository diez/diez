import {readJson, remove} from 'fs-extra';
import {root} from "../internal/helpers";
import glob from 'glob';
import {join} from 'path';

const filesToDelete = [
  'lib',
  'tsconfig.tsbuildinfo',
  'yarn-error.log',
  'test-result.tap',
  'cobertura-coverage.xml',
  'checkstyle-result.xml',
  '.DS_Store',
];

export const clean = async () => {
  const config = await readJson(join(root, 'package.json'));
  for (const workspace of config.workspaces) {
    // Intentionally adding a `/` to the workspace path to tell `glob`
    // that we only want to match directories
    const matches = glob.sync(`${workspace}/`, {root});
    for (const match of matches) {
      for (const fileToDelete of filesToDelete) {
        await remove(join(match, fileToDelete));
      }
    }
  }
};
