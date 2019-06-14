import {diezVersion, fatalError} from '@diez/cli-core';
import {readJsonSync, writeJsonSync} from 'fs-extra';
import {join} from 'path';
import {gte, valid} from 'semver';
import {root, run, runQuiet, siteRoot} from '../internal/helpers';

export = {
  name: 'release [version]',
  description: 'Creates a release.',
  loadAction: () => async (_: {}, rawVersion: string) => {
    const version = valid(rawVersion);
    if (!version || gte(diezVersion, version)) {
      fatalError('Refusing to set an invalid or lower version.');
    }

    if (runQuiet('git rev-parse --abbrev-ref HEAD') !== 'master') {
      fatalError('You must be on the `master` branch to create a release.');
    }

    if (
      runQuiet('git remote get-url upstream') !== 'git@github.com:diez/diez.git' ||
      runQuiet('git ls-remote --get-url') !== 'git@github.com:diez/diez.git'
    ) {
      fatalError('You must have an `upstream` remote at `git@github.com:diez/diez.git` to create a release.');
    }

    if (runQuiet('git diff') || runQuiet('git diff --staged')) {
      fatalError('Working tree has untracked changes; unable to proceed.');
    }

    run('git fetch upstream --tags');
    if (runQuiet('git diff upstream/master')) {
      fatalError('You must be up to date on the latest `master` branch to create a release.');
    }

    try {
      runQuiet('aws s3 ls s3://diez-docs');
      runQuiet(`aws cloudfront get-distribution-config --id ${process.env.DIEZ_WWW_DISTRIBUTION_SECRET}`);
      runQuiet(`aws cloudfront get-distribution-config --id ${process.env.DIEZ_EXAMPLES_DISTRIBUTION}`);
    } catch (e) {
      fatalError('Unable to run AWS S3 and CloudFront commands. `aws` is either not installed or missing privileges.');
    }

    run('yarn clean');
    const docs = runQuiet('yarn docs');
    if (docs.includes('Error:')) {
      fatalError('Generating docs produced an error. Please fix the issue and try again.');
    }

    // Upload the latest version of lorem-ipsum templates for `diez create` to the CDN.
    run(`yarn extract-lorem-ipsum --currentVersion ${version}`);

    const versionsPath = join(siteRoot, 'docs', '.vuepress', 'theme', 'data', 'diez-versions.json');
    const versions = readJsonSync(versionsPath);
    if (versions.length) {
      versions[0] = {version: versions[0].version, name: versions[0].version};
    }
    versions.unshift({version, name: `latest (${version})`});
    writeJsonSync(versionsPath, versions, {spaces: 2});

    // Manually bump the monorepo package.json version of `diez`.
    const packageJsonPath = join(root, 'package.json');
    const packageJson = readJsonSync(packageJsonPath);
    packageJson.devDependencies.diez = version;
    writeJsonSync(packageJsonPath, packageJson, {spaces: 2});
    run(`git add package.json ${versionsPath}`);
    run(`git commit -m 'prerelease: ${version}'`);

    run(`aws s3 sync api s3://diez-docs/${version}`);
    run('aws s3 sync api s3://diez-docs/latest');

    run('yarn diez release-site');

    // Create the release with Lerna.
    run(`yarn lerna publish ${version} --git-remote upstream --github-release --conventional-commits --yes`);
  },
};
