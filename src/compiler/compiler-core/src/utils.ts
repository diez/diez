import {cliRequire, findOpenPort, findPlugins, getCandidatePortRange, Log} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {noCase} from 'change-case';
import {readFile} from 'fs-extra';
import {dirname, join, resolve} from 'path';
import {SourceMapConsumer} from 'source-map';
import {Node, Project, TypeGuards} from 'ts-morph';
import {findConfigFile, sys} from 'typescript';
import {AcceptableType, AssemblerFactory, CompilerProvider, ComponentModule,
  Constructor, DiezType, NamedComponentMap, PropertyDescription, TargetOutput} from './api';

/**
 * A type guard for identifying a [[Constructor]] vs. a plain object.
 * @ignore
 */
export const isConstructible = (maybeConstructible: any): maybeConstructible is Constructor =>
  maybeConstructible.prototype !== undefined && maybeConstructible.prototype.constructor instanceof Function;

/**
 * Gets the project root for the current process. The default project root is the current working directory
 * of the process. This can be overridden using `projectRoot` in `.diezrc`.
 */
export const getProjectRoot = async () => {
  const rawConfiguration = (await findPlugins()).get('.');
  const configuredProjectRoot = rawConfiguration && rawConfiguration.projectRoot;
  return resolve(configuredProjectRoot || global.process.cwd());
};

/**
 * Shared cache for retrieving Projects.
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
  project.compilerOptions.set({
    // Enabling this option greatly speeds up builds.
    skipLibCheck: true,
    // See https://github.com/Microsoft/TypeScript/issues/7363.
    suppressOutputPathCheck: true,
    // Instead of emitting invalid code, we should bail on compilation.
    noEmitOnError: true,
    // Emit source maps for better error reporting.
    sourceMap: true,
  });

  projectCache.set(projectRoot, project);
  return project;
};

/**
 * @internal
 */
const targets = new Map<Target, CompilerProvider>();

/**
 * Retrieves the set of available targets for the compiler.
 */
export const getTargets = async (): Promise<Map<Target, CompilerProvider>> => {
  if (targets.size > 0) {
    return targets;
  }

  for (const [plugin, {providers}] of await findPlugins()) {
    if (!providers || !providers.targets) {
      continue;
    }

    for (const path of providers.targets) {
      const provider = cliRequire<CompilerProvider>(plugin, path);
      const providerName = provider.name.toLowerCase() as Target;
      if (targets.has(providerName)) {
        throw new Error(`A target named ${providerName} is already registered.`);
      }
      targets.set(providerName, provider);
    }
  }

  return targets;
};

const hashComponent = (source: string, componentName: DiezType) => `${source}:${componentName}`;
const hashBinding = (target: string,
  source: string, componentName: DiezType) => `${target}|${hashComponent(source, componentName)}`;
const bindingLocations = new Map<string, string>();
const resolvedBindings = new Map<string, any>();

/**
 * @internal
 */
const getBindingLocation = async (
  target: string,
  source: string,
  componentName: DiezType,
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
          Log.warning(`Found duplicate binding compilation instructions for target ${targetName}. Component: ${componentHash}. Only the first binding will be used.`);
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
  componentName: DiezType,
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
    Log.warning(`A binding for ${componentName} was specified, but could not be loaded from ${location}.`);
    resolvedBindings.set(hash, undefined);
    return undefined;
  }
};

/**
 * Retrieves an [[AssemblerFactory]] for the specific [[Target]].
 */
export const getAssemblerFactory = async <T extends TargetOutput>(target: Target) => {
  for (const [plugin, {providers}] of await findPlugins()) {
    if (!providers || !providers.assemblers || !providers.assemblers || !providers.assemblers[target]) {
      continue;
    }

    return cliRequire<AssemblerFactory<T>>(plugin, providers.assemblers[target]!);
  }

  throw new Error(`Unable to find assembler for target: ${target}`);
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

    Log.warning(`Component: ${name}`);
    Log.warning(
      '  The following properties are of an unknown or invalid type. Please ensure your component definition includes complete type annotations.');
    targetComponent.warnings.ambiguousTypes.forEach((property) => Log.warning(`  - ${property}`));
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

/**
 * Infers package name from the project root.
 * @internal
 * @ignore
 */
export const inferProjectName = (projectRoot: string) => {
  try {
    return noCase(require(join(projectRoot, 'package.json')).name as string, undefined, '-');
  } catch (error) {
    return 'design-language';
  }
};

/**
 * Infers package version from the project root.
 * @internal
 * @ignore
 */
export const inferProjectVersion = (projectRoot: string) => {
  try {
    return require(join(projectRoot, 'package.json')).version as string;
  } catch (error) {
    return '0.1.0';
  }
};

/**
 * A typeguard for determining if a type value has an acceptable type for transpilation purposes.
 */
export const isAcceptableType = (typeValue?: Node): typeValue is AcceptableType => {
  if (typeValue === undefined) {
    return false;
  }

  return TypeGuards.isClassDeclaration(typeValue) || TypeGuards.isObjectLiteralExpression(typeValue);
};

const getDescriptionForLiteralValue = (typeVale: Node): PropertyDescription => {
  if (typeVale) {
    let typeValeNode = typeVale;
    if (TypeGuards.isObjectLiteralExpression(typeVale)) {
      // we need three parents deep to get the object comments
      const parent = typeVale.getParent();
      if (parent) {
        const grandParent = parent.getParent();
        if (grandParent) {
          const greatGrandParent = grandParent.getParent();
          if (greatGrandParent) {
            typeValeNode = greatGrandParent;
          }
        }
      }
    }
    const maybeComment = typeValeNode.getFirstChild();
    if (maybeComment && TypeGuards.isJSDoc(maybeComment)) {
      return {body: maybeComment.getComment() || ''};
    }
  }
  return {body: ''};
};
/**
 * Retrives the description for an acceptable type.
 */
export const getDescriptionForValue = (typeValue: Node): PropertyDescription => {
  const describable = (TypeGuards.isClassDeclaration(typeValue) || TypeGuards.isPropertyDeclaration(typeValue)) ?
    typeValue :
    typeValue.getParent();
  if (!describable || !TypeGuards.isJSDocableNode(describable)) {
    return getDescriptionForLiteralValue(typeValue);
  }

  const lines = [];
  for (const jsDoc of describable.getJsDocs()) {
    const comment = jsDoc.getComment();
    if (comment !== undefined) {
      lines.push(comment);
    }
  }

  return {body: lines.join('\n')};
};

/**
 * Custom error class intended to be used on errors related to existing hot URL mutex.
 */
export class ExistingHotUrlMutexError extends Error {
  mutexPath: string;

  constructor (message: string, mutexPath: string) {
    super(message);
    this.name = 'ExistingHotUrlMutexError';
    this.message = message;
    this.mutexPath = mutexPath;
  }
}

/**
 * Tries to show the best possible stack trace inferred from a runtime error.
 */
export const showStackTracesFromRuntimeError = async (error: Error) => {
  if (error.stack === undefined) {
    Log.error(error.message);
    return;
  }

  const firstStackTrace = error.stack.split('\n')[1];
  if (!firstStackTrace) {
    Log.error(error.toString());
    return;
  }

  const rawFile = firstStackTrace.match(/\(([^\)]+)\)/);

  if (!rawFile) {
    Log.error(error.toString());
    return;
  }

  const [file, line, column] = rawFile[1].split(':');

  if (!file || !line || !column) {
    Log.error(error.toString());
    return;
  }
  try {
    const rawSourceMap = await readFile(`${file}.map`);
    const sourceMap = await new SourceMapConsumer(rawSourceMap.toString());
    const originalPosition = sourceMap.originalPositionFor({line: Number(line), column: Number(column)});
    const originalFile = resolve(file, '..', originalPosition.source || '');
    Log.error(error.message);
    Log.error(`    at ${originalFile}:${originalPosition.line}:${originalPosition.column}`);
    if (originalPosition.line) {
      const fileContents = await readFile(originalFile);
      const lineContents = fileContents.toString().split('\n')[originalPosition.line - 1];
      let caret = '';
      if (originalPosition.column) {
        caret = `${' '.repeat(originalPosition.column - 1 || 0)}^`;
      }
      Log.code(`${lineContents}\n${caret}`);
    }
  } catch (internalError) {
    Log.error(error.toString());
  }
};
