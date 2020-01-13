import {diezVersion} from '@diez/cli-core';
import {readJsonSync, writeJsonSync} from 'fs-extra';
import {join} from 'path';
import {gte, parse, valid} from 'semver';
import {root, run, runQuiet, scriptsRoot} from '../internal/helpers';

interface ReleaseOptions {
  distTag: string;
}

export = {
  name: 'release [version]',
  description: 'Creates a release.',
  options: [
    {
      longName: 'dist-tag',
      description: 'Set a distribution tag in npm',
      valueName: 'distTag',
    },
  ],
  loadAction: () => async (options: ReleaseOptions, rawVersion: string) => {
    const distTag = options.distTag || 'latest';
    const version = valid(rawVersion);
    if (!version || gte(diezVersion, version)) {
      throw new Error('Refusing to set an invalid or lower version.');
    }

    if (runQuiet('git rev-parse --abbrev-ref HEAD') !== 'master') {
      throw new Error('You must be on the `master` branch to create a release.');
    }

    if (
      runQuiet('git remote get-url origin') !== 'git@github.com:diez/diez.git' ||
      runQuiet('git ls-remote --get-url') !== 'git@github.com:diez/diez.git'
    ) {
      throw new Error('You must track an `origin` remote at `git@github.com:diez/diez.git` to create a release.');
    }

    if (runQuiet('git diff') || runQuiet('git diff --staged')) {
      throw new Error('Working tree has untracked changes; unable to proceed.');
    }

    run('git fetch origin --tags');
    if (runQuiet('git diff origin/master')) {
      throw new Error('You must be up to date on the latest `master` branch to create a release.');
    }

    try {
      runQuiet('aws s3 ls s3://diez-docs');
      runQuiet(`aws cloudfront get-distribution-config --id ${process.env.DIEZ_EXAMPLES_DISTRIBUTION}`);
    } catch (e) {
      throw new Error('Unable to run AWS S3 and CloudFront commands. `aws` is either not installed or missing privileges.');
    }

    try {
      runQuiet('sentry-cli projects -o haiku-systems list');
    } catch (e) {
      throw new Error('Unable to run Sentry CLI commands. `sentry-cli` is either not installed or missing privileges.');
    }

    run('yarn clean');
    const docs = runQuiet('yarn docs');
    if (docs.includes('Error:')) {
      throw new Error('Generating docs produced an error. Please fix the issue and try again.');
    }

    const versionsPath = join(scriptsRoot, 'data', 'diez-versions.json');
    const versions = readJsonSync(versionsPath);
    if (versions.length) {
      const lastVersionParsed = parse(versions[0].version);
      const versionParsed = parse(version);
      if (!lastVersionParsed || !versionParsed) {
        throw new Error('Unable to parse semantic versions.');
      }
      if (
        lastVersionParsed.major === versionParsed.major &&
        lastVersionParsed.minor === versionParsed.minor
      ) {
        // According to the rules of semantic versioning, we will only have bugfixes here, and can safely overwrite the
        // old version.
        versions[0] = {version, name: `latest (${version})`};
      } else {
        // Either the major or minor versions has changed, so we should shift the new version to the top of the stack.
        versions[0] = {version: lastVersionParsed.version, name: lastVersionParsed.version};
        versions.unshift({version, name: `latest (${version})`});
      }
    } else {
      // We're setting a new version for the first time.
      versions.push({version, name: `latest (${version})`});
    }

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

    // Create the release with Lerna.
    run(`yarn lerna publish ${version} --github-release --conventional-commits --force-publish=* --dist-tag ${distTag}`);
    // Upload the latest version of lorem-ipsum templates for `diez create` to the CDN.
    run(`yarn extract-lorem-ipsum --currentVersion ${version}`);
  },
};
