import {canRunCommand, devDependencies, diezVersion, execAsync, fatalError, warning} from '@diez/cli-core';
import {downloadStream, outputTemplatePackage} from '@diez/storage';
import {spawnSync} from 'child_process';
import {ensureDirSync, existsSync, lstatSync} from 'fs-extra';
import pascalCase from 'pascal-case';
import {basename, join, resolve} from 'path';
import {x} from 'tar';
import validateNpmPackageName from 'validate-npm-package-name';

/**
 * Validates that a package name is valid and nonconflicting.
 */
const validatePackageName = (packageName: string) => {
  const validationResult = validateNpmPackageName(packageName);
  if (!validationResult.validForNewPackages) {
    const warnings = [];
    if (validationResult.errors) {
      warnings.push(...validationResult.errors.map((message) => ` - ${message}`));
    }
    if (validationResult.warnings) {
      warnings.push(...validationResult.warnings.map((message) => ` - ${message}`));
    }

    if (warnings.length) {
      warning('Project name validation failed:');
      warnings.forEach(warning);
    }

    fatalError(`Unable to create project with name ${packageName}.`);
  }
};

/**
 * Provides an async check for if we are equipped to use `yarn` for package management operations.
 * @internal
 */
const shouldUseYarn = () => canRunCommand('yarnpkg --version');

/**
 * Provides an async check for if we are equipped to use `npm` in the current root as fallback for package management
 * operations.
 *
 * @see {@link https://github.com/facebook/create-react-app/blob/7864ba3/packages/create-react-app/createReactApp.js#L826}.
 * @ignore
 */
export const canUseNpm = async (root: string) => {
  let childOutput = null;
  try {
    // Note: intentionally using `spawn` over `exec` since
    // some scenarios doesn't reproduce otherwise.
    // `npm config list` is the only reliable way I could find
    // to reproduce the wrong path. Just printing process.cwd()
    // in a Node process was not enough.
    childOutput = spawnSync('npm', ['config', 'list']).output.join('');
  } catch (_) {
    // Something went wrong spawning node.
    // Not great, but it means we can't do this check.
    return true;
  }
  if (typeof childOutput !== 'string') {
    return true;
  }

  // `npm config list` output includes the following line:
  // "; cwd = C:\path\to\current\dir" (unquoted)
  const matches = childOutput.match(/^; cwd = (.*)$/m);
  if (matches === null) {
    // Fail gracefully. They could remove it.
    return true;
  }

  return matches[1] === root;
};

/**
 * Validates that a directory can be used as a project root.
 *
 * @internal
 */
const validateProjectRoot = async (root: string, useYarn = false) => {
  if (existsSync(root) && !lstatSync(root).isDirectory()) {
    fatalError(`Found a non-directory at ${root}.`);
  }

  ensureDirSync(root);
  if (existsSync(join(root, 'package.json'))) {
    fatalError(`A Node.js project already exists at ${root}.`);
  }

  if (useYarn) {
    return;
  }

  if (!await canUseNpm(root)) {
    fatalError(`Unable to start an NPM process in ${root}.`);
  }
};

const downloadAssets = async (cwd: string) => {
  const stream = await downloadStream('https://examples.diez.org/createproject/createproject-assets.tgz');
  if (!stream) {
    throw new Error('Unable to download example assets from examples.diez.org. Please try again.');
  }

  stream.pipe(x({cwd}));
  return;
};

/**
 * Creates a project with the given name in the specified current working directory.
 * @ignore
 */
export const createProject = async (packageName: string, cwd = process.cwd()) => {
  validatePackageName(packageName);

  const useYarn = await shouldUseYarn();
  const root = resolve(cwd, basename(packageName));
  await validateProjectRoot(root, useYarn);

  const templateRoot = resolve(__dirname, '..', 'templates');
  const tokens = {
    packageName,
    diezVersion,
    typescriptVersion: devDependencies.typescript,
    componentName: pascalCase(basename(packageName)),
  };

  outputTemplatePackage(join(templateRoot, 'project'), root, tokens);

  const commands: Promise<any>[] = [
    useYarn ? execAsync('yarn install', {cwd: root}) : execAsync('npm install', {cwd: root}),
    downloadAssets(root),
  ];

  await Promise.all(commands);
  // TODO: print instructions.
};
