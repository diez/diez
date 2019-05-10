/* tslint:disable:max-line-length */
import {canRunCommand, cliRequire, devDependencies, diezVersion, fatalError, findOpenPort, findPlugins, getCandidatePortRange, warning} from '@diez/cli-core';
import {outputTemplatePackage} from '@diez/storage';
import {execSync} from 'child_process';
import {copySync, ensureDirSync, existsSync, lstatSync} from 'fs-extra';
import {tmpdir} from 'os';
import pascalCase from 'pascal-case';
import {basename, dirname, join, resolve} from 'path';
import {Project} from 'ts-morph';
import {findConfigFile, sys} from 'typescript';
import {v4} from 'uuid';
import validateNpmPackageName from 'validate-npm-package-name';
import {CompilerTargetProvider, ComponentModule, NamedComponentMap, PropertyType} from './api';

/**
 * Provides an async check for if we are equipped to use `yarn` for package management operations.
 * @internal
 */
const shouldUseYarn = () => canRunCommand('yarnpkg --version');

/**
 * Shared singleton for retrieving Projects.
 *
 * Exported for testing purposes only.
 * @internal
 * @ignore
 */
export const projectCache = new Map<string, Project>();

/**
 * Retrieves a Project from a project root.
 * @ignore
 */
export const getProject = (projectRoot: string) => {
  if (projectCache.has(projectRoot)) {
    return projectCache.get(projectRoot)!;
  }

  const tsConfigFilePath = findConfigFile(projectRoot, sys.fileExists, 'tsconfig.json')!;

  if (!tsConfigFilePath) {
    throw new Error('Unable to proceed: TypeScript configuration not found.');
  }

  const project = new Project({tsConfigFilePath});
  projectCache.set(projectRoot, project);
  return project;
};

/**
 * Provides a unique temporary filename.
 * @ignore
 */
export const getTempFileName = () => join(tmpdir(), v4());

/**
 * Provides an async check for if we are equipped to use `npm` in the current root as fallback for package management
 * operations.
 *
 * @todo Fill in this method body.
 * @see {@link https://github.com/facebook/create-react-app/blob/7864ba3/packages/create-react-app/createReactApp.js#L826}.
 */
const canUseNpm = async (root: string) => Promise.resolve(true);

/**
 * @internal
 */
const targets = new Map<string, CompilerTargetProvider>();

/**
 * Retrieves the set of available targets for the compiler.
 */
export const getTargets = async (): Promise<Map<string, CompilerTargetProvider>> => {
  if (targets.size > 0) {
    return targets;
  }

  for (const [plugin, {providers}] of await findPlugins()) {
    if (!providers || !providers.targets) {
      continue;
    }

    for (const path of providers.targets) {
      const provider = cliRequire<CompilerTargetProvider>(plugin, path);
      const providerName = provider.name.toLowerCase();
      if (targets.has(providerName)) {
        fatalError(`A target named ${providerName} is already registered.`);
      }
      targets.set(providerName, provider);
    }
  }

  return targets;
};

const hashComponent = (source: string, componentName: PropertyType) => `${source}:${componentName}`;
const hashBinding = (target: string, source: string, componentName: PropertyType) => `${target}|${hashComponent(source, componentName)}`;
const bindingLocations = new Map<string, string>();
const resolvedBindings = new Map<string, any>();

/**
 * @internal
 */
const getBindingLocation = async (
  target: string,
  source: string,
  componentName: PropertyType,
): Promise<string | undefined> => {
  const hash = hashBinding(target, source, componentName);
  if (bindingLocations.size > 0) {
    return bindingLocations.get(hash);
  }

  for (const [plugin, {bindings}] of await findPlugins()) {
    if (!bindings) {
      continue;
    }

    for (const componentHash in bindings) {
      for (const targetName in bindings[componentHash]) {
        const newHash = `${targetName}|${componentHash}`;
        if (bindingLocations.has(newHash)) {
          fatalError(`Found duplicate binding compilation instructions for target ${targetName}. Component: ${componentHash}.`);
        }

        bindingLocations.set(
          newHash,
          join(plugin === '.' ? global.process.cwd() : plugin, bindings[componentHash][targetName]),
        );
      }
    }
  }

  return bindingLocations.get(hash);
};

/**
 * Retrieves a binding for a given target and component source.
 *
 * @typeparam T - The [[TargetBinding]] we are attempting to load.
 */
export const getBinding = async <T>(
  target: string,
  source: string,
  componentName: PropertyType,
): Promise<T | undefined> => {
  const hash = hashBinding(target, source, componentName);
  if (resolvedBindings.has(hash)) {
    return resolvedBindings.get(hash);
  }
  const location = await getBindingLocation(target, source, componentName);
  if (!location) {
    resolvedBindings.set(hash, undefined);
    return undefined;
  }

  try {
    const binding = require(location) as T;
    resolvedBindings.set(hash, binding);
    return binding;
  } catch (e) {
    warning(`A binding for ${componentName} was specified, but could not be loaded from ${location}.`);
    resolvedBindings.set(hash, undefined);
    return undefined;
  }
};

/**
 * An internal map from filenames to component sources from node_modules.
 * @internal
 */
const nodeModulesSourceMap = new Map<string, string>();

/**
 * Caches and returns a component's source from node_modules, based on its file path.
 * @ignore
 */
export const getNodeModulesSource = (filePath: string): string | undefined => {
  if (nodeModulesSourceMap.has(filePath)) {
    return nodeModulesSourceMap.get(filePath);
  }
  const [maybeNamespace, maybePackageName] = filePath.replace(new RegExp('^.*node_modules/?'), '').split('/');
  try {
    // Check for a namespaced import.
    const candidateNamespaced = `${maybeNamespace}/${maybePackageName}`;
    require.resolve(candidateNamespaced);
    nodeModulesSourceMap.set(filePath, candidateNamespaced);
    return candidateNamespaced;
  } catch (_) {
    try {
      // Check for a plain import.
      require.resolve(maybeNamespace);
      nodeModulesSourceMap.set(filePath, maybeNamespace);
      return maybeNamespace;
    } catch (__) {
      return;
    }
  }
};

/**
 * Prints all warnings encountered while processing a target component.
 * @ignore
 */
export const printWarnings = (targetComponents: NamedComponentMap) => {
  for (const [name, targetComponent] of targetComponents) {
    if (!targetComponent.warnings.ambiguousTypes.size) {
      continue;
    }

    warning(`Component: ${name}`);
    warning(
      '  The following properties are of an unknown or invalid type. Please ensure your component definition includes complete type annotations.');
    targetComponent.warnings.ambiguousTypes.forEach((property) => warning(`  - ${property}`));
  }
};

/**
 * Gets a hot port in the range 8080-8180 for hot serving Diez projects.
 * @ignore
 */
export const getHotPort = async () => findOpenPort(getCandidatePortRange(8080, 100));

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
  copySync(join(templateRoot, 'assets'), join(root, 'assets'));

  if (useYarn) {
    await execSync('yarn install', {cwd: root});
  } else {
    await execSync('npm install', {cwd: root});
  }
  // TODO: print instructions.
};

/**
 * Loads and returns a component module asynchronously.
 *
 * @param projectRoot - The root of the project providing a component module.
 * @ignore
 */
export const loadComponentModule = async (projectRoot: string): Promise<ComponentModule> => await import(projectRoot);

/**
 * Purges the require cache for a path. Used during hot module reloading to ensure pristine parses.
 * @ignore
 */
export const purgeRequireCache = (path: string, prefix?: string) => {
  const modulePrefix = prefix || dirname(path);
  if (require.cache[path]) {
    for (const child of require.cache[path].children) {
      if (child.id.startsWith(modulePrefix)) {
        purgeRequireCache(child.id);
      }
    }
    delete require.cache[path];
  }
};
