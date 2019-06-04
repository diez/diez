import {cliRequire, findOpenPort, findPlugins, getCandidatePortRange, warning} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {dirname, join} from 'path';
import {Project} from 'ts-morph';
import {findConfigFile, sys} from 'typescript';
import {CompilerTargetProvider, ComponentModule, NamedComponentMap, PropertyType} from './api';

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

  const project = new Project({tsConfigFilePath, compilerOptions: {incremental: false}});
  projectCache.set(projectRoot, project);
  return project;
};

/**
 * @internal
 */
const targets = new Map<Target, CompilerTargetProvider>();

/**
 * Retrieves the set of available targets for the compiler.
 */
export const getTargets = async (): Promise<Map<Target, CompilerTargetProvider>> => {
  if (targets.size > 0) {
    return targets;
  }

  for (const [plugin, {providers}] of await findPlugins()) {
    if (!providers || !providers.targets) {
      continue;
    }

    for (const path of providers.targets) {
      const provider = cliRequire<CompilerTargetProvider>(plugin, path);
      const providerName = provider.name.toLowerCase() as Target;
      if (targets.has(providerName)) {
        throw new Error(`A target named ${providerName} is already registered.`);
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
          warning(`Found duplicate binding compilation instructions for target ${targetName}. Component: ${componentHash}. Only the first binding will be used.`);
          continue;
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
