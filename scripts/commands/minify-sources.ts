import {canRunCommand, diezVersion} from '@diez/cli-core';
import {existsSync, outputFileSync, readFileSync, readJsonSync} from 'fs-extra';
import glob from 'glob';
import {basename, dirname, join, relative} from 'path';
import {minify, MinifyOptions} from 'uglify-es';
import {assertNotWatching, root, run} from '../internal/helpers';

export = {
  name: 'minify-sources',
  description: 'Minifies sources and uploads to Sentry as a prepack step.',
  loadAction: () => async () => {
    assertNotWatching();
    if (!await canRunCommand('sentry-cli --version')) {
      throw new Error('sentry-cli is not installed.');
    }
    // Create source maps for our original transpiled TypeScript.
    run('rm -f src/*/*/tsconfig.tsbuildinfo');
    const tsConfigPaths = glob.sync(join(root, 'src/*/*/tsconfig.json'));
    for (const tsConfigPath of tsConfigPaths) {
      const packageRoot = dirname(tsConfigPath);
      const sourceRoot = `/@diez/${basename(packageRoot)}/src`;
      run(`yarn tsc --sourceMap --sourceRoot ${sourceRoot}`, packageRoot);
    }
    const filePaths = glob.sync(join(root, 'src/*/*/lib/**/*.js'));
    let minificationError = false;
    for (const filePath of filePaths) {
      const contents = readFileSync(filePath).toString();
      const mapPath = `${filePath}.map`;
      const minifyOptions: MinifyOptions = {
        mangle: true,
        toplevel: true,
      };
      const mapExists = existsSync(mapPath);
      if (mapExists) {
        minifyOptions.sourceMap = {
          content: readJsonSync(mapPath),
          url: `/${relative(root, mapPath)}`,
          includeSources: false,
        };
      }
      const minified = minify(contents, minifyOptions);

      if (minified.error) {
        minificationError = true;
        throw new Error(`Unable to minify ${filePath}!`);
      }

      outputFileSync(filePath, minified.code);
      if (mapExists) {
        outputFileSync(mapPath, minified.map);
      }
    }

    if (minificationError) {
      process.exit(1);
    }

    // Upload all source maps to Sentry
    const sentryOrganization = 'haiku-systems';
    const sentryProject = 'diez-cli';
    const getSentryCommand = (command: string, subcommand: string) =>
    `sentry-cli releases -o ${sentryOrganization} -p ${sentryProject} ${command} v${diezVersion} ${subcommand}`;

    run(`sentry-cli releases -o ${sentryOrganization} new -p ${sentryProject} v${diezVersion}`);
    run(getSentryCommand('set-commits', '--commit "diez/diez"'));

    for (const packageRoot of glob.sync(join(root, 'src/*/*'))) {
      const {name: packageName} = require(join(packageRoot, 'package.json'));
      if (!packageName.startsWith('@diez')) {
        continue;
      }

      const relevantPaths = [
        ...glob.sync(join(packageRoot, '**/*.js')),
        ...glob.sync(join(packageRoot, '**/*.js.map')),
        ...glob.sync(join(packageRoot, '**/*.ts')),
      ];
      for (const filePath of relevantPaths) {
        const virtualUrl = `~/@diez/${relative(packageRoot, filePath)}`;
        run(getSentryCommand('files', `upload ${filePath} '${virtualUrl}'`));
      }
    }
  },
};
