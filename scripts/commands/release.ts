import {diezVersion, fatalError} from '@diez/cli-core';
import {readJsonSync, writeJsonSync} from 'fs-extra';
import {join} from 'path';
import {gte} from 'semver';
import {root, run, runQuiet} from '../internal/helpers';

export = {
  name: 'release [version]',
  description: 'Creates a release.',
  action: async (_: {}, version: string) => {
    if (!version || gte(diezVersion, version)) {
      fatalError('Refusing to set a lower version.');
    }

    if (runQuiet('git rev-parse --abbrev-ref HEAD') !== 'master') {
      fatalError('You must be on the `master` branch to create a release.');
    }

    if (runQuiet('git diff')) {
      fatalError('Working tree has untracked changes; unable to proceed.');
    }

    run('git fetch');
    if (runQuiet('git diff origin/master')) {
      fatalError('You must be up to date on the latest `master` branch to create a release.');
    }

    try {
      runQuiet('aws s3 ls s3://diez-docs');
    } catch (e) {
      fatalError('Unable to run AWS S3 commands. `aws` is either not installed or missing privileges.');
    }

    run('yarn clean');
    const docs = runQuiet('yarn docs');
    if (docs.includes('Error:')) {
      fatalError('Generating docs produced an error. Please fix the issue and try again.');
    }

    run(`aws s3 sync api s3://diez-docs/${version}`);
    run('aws s3 sync api s3://diez-docs/latest');

    // Manually bump the monorepo package.json version of `diez`.
    const packageJsonPath = join(root, 'package.json');
    const packageJson = readJsonSync(packageJsonPath);
    packageJson.devDependencies['diez'] = version;
    writeJsonSync(packageJsonPath, packageJson, {spaces: 2});
    run('git add package.json');
    run(`git commit -m 'prerelease: ${version}'`);

    // Create the release with Lerna.
    run(`yarn lerna publish ${version} --github-release --conventional-commits --yes`);
  },
};
