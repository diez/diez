import {canRunCommand, devDependencies, diezVersion, execAsync, fatalError, info, inlineCodeSnippet, inlineComment, warning} from '@diez/cli-core';
import {downloadStream, getTempFileName, outputTemplatePackage} from '@diez/storage';
import {
  camelCase,
  constantCase,
  dotCase,
  headerCase,
  kebabCase,
  lowerCase,
  noCase,
  pascalCase,
  snakeCase,
  titleCase,
} from 'change-case';
import {spawnSync} from 'child_process';
import {ensureDirSync, existsSync, lstatSync} from 'fs-extra';
import {basename, join, resolve} from 'path';
import {x} from 'tar';
import validateNpmPackageName from 'validate-npm-package-name';

const examplesBaseUrl = `https://examples.diez.org/${diezVersion}/createproject/`;

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
  info('Downloading assets from the Diez CDN...');
  const stream = await downloadStream(`${examplesBaseUrl}assets.tgz`);
  if (!stream) {
    throw new Error('Unable to download example assets from examples.diez.org. Please try again.');
  }

  stream.pipe(x({cwd}));
  return;
};

const downloadAndExtractExample = async (templateRoot: string, target: string) => {
  info(`Downloading example project from the Diez CDN for target: ${target}...`);
  const stream = await downloadStream(`${examplesBaseUrl}examples/${target}.tgz`);
  if (!stream) {
    warning(`Unable to download ${target} example project from examples.diez.org. Please try again.`);
    return;
  }

  const writeStream = x({cwd: templateRoot});
  stream.pipe(writeStream);

  return new Promise((onComplete) => writeStream.on('close', onComplete));
};

const populateExamples = async (cwd: string, name: string, targets: string[]) => {
  if (targets.length === 0) {
    return;
  }

  const templateRoot = resolve(getTempFileName(), 'examples');
  ensureDirSync(templateRoot);

  const downloads = targets.map((target) => downloadAndExtractExample(templateRoot, target));
  await Promise.all(downloads);

  const pascalCased = pascalCase(name);
  const lowerCased = lowerCase(pascalCased);
  const tokens = {
    openTag: '{{',
    closeTag: '}}',
    namePascalCase: pascalCased,
    nameLowerCase: lowerCased,
    nameKebabCase: kebabCase(name),
    nameCamelCase: camelCase(name),
    nameTitleCase: titleCase(name),
    nameNoCase: noCase(name),
    nameSnakeCase: snakeCase(name),
    nameConstantCase: constantCase(name),
    nameHeaderCase: headerCase(name),
    nameDotCase: dotCase(name),
  };

  const destination = join(cwd, 'examples');
  ensureDirSync(destination);

  return outputTemplatePackage(templateRoot, destination, tokens);
};

const copyTemplate = async (templateRoot: string, root: string, tokens: {}, useYarn: boolean) => {
  info('Generating template project...');
  await outputTemplatePackage(templateRoot, root, tokens);
  info('Installing packages. This might take a couple of minutes.');
  return execAsync(`${useYarn ? 'yarn' : 'npm'} install`, {cwd: root});
};

/**
 * Creates a project with the given name in the specified current working directory.
 * @ignore
 */
export const createProject = async (packageName: string, targets: string[], cwd = process.cwd()) => {
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
    ios: targets.includes('ios'),
    android: targets.includes('android'),
    web: targets.includes('web') || targets.length === 0,
  };

  ensureDirSync(root);
  await copyTemplate(join(templateRoot, 'project'), root, tokens, useYarn);

  const commands: Promise<any>[] = [
    downloadAssets(root),
    populateExamples(root, packageName, targets),
  ];

  await Promise.all(commands);
  info(`Success! A new Diez (DS) has been created at ${inlineComment(root)}.`);
  info('In that directory, you can run commands like:');
  for (const target of (targets.length ? targets : ['web'])) {
    info(`
  ${inlineCodeSnippet(`${useYarn ? 'yarn' : 'npm run'} build-${target}`)}
    Runs ${inlineComment(`diez compile --target ${target}`)} for your Diez project.`);
  }

  info('\nCheck out https://beta.diez.org/getting-started to learn more.');
};
