import {fatalError} from '@diez/cli-core';
import {outputFileSync, readFileSync} from 'fs-extra';
import glob from 'glob';
import {join} from 'path';
import {minify} from 'uglify-es';
import {assertNotWatching, root} from '../internal/helpers';

export = {
  name: 'minify-sources',
  description: 'Minifies sources as a prepack step.',
  action: async () => {
    assertNotWatching();
    const filePaths = glob.sync(join(root, 'packages/*/lib/**/*.js'));
    let minificationError = false;
    for (const filePath of filePaths) {
      const contents = readFileSync(filePath).toString();
      const minified = minify(
        contents,
        {
          mangle: true,
          toplevel: true,
        },
      );

      if (minified.error) {
        minificationError = true;
        fatalError(`Unable to minify ${filePath}!`);
      }

      outputFileSync(filePath, minified.code);
    }

    if (minificationError) {
      process.exit(1);
    }
  },
};
