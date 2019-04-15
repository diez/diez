/* tslint:disable:max-line-length */
import {execAsync, fatalError, findPlugins, warning} from '@diez/cli';
import {execSync} from 'child_process';
import {existsSync} from 'fs';
import {readJsonSync} from 'fs-extra';
import {join, sep} from 'path';
import {ClassDeclaration, Project, PropertyDeclaration, ts, Type, TypeChecker} from 'ts-morph';
import {CompilerOptions, findConfigFile, sys} from 'typescript';
import {CompilerTargetHandler, CompilerTargetProvider, NamedComponentMap, TargetComponent, TargetComponentWarnings} from './api';

/**
 * Provides an async check for if we are equipped to use `yarn` for package management operations.
 */
export const shouldUseYarn = async () => {
  try {
    await execAsync('yarnpkg --version');
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Provides an async check for if we are equipped to use `npm` in the current root as fallback for package management
 * operations.
 *
 * @todo Fill in this method body.
 * @see {@link https://github.com/facebook/create-react-app/blob/7864ba3/packages/create-react-app/createReactApp.js#L826}.
 */
export const canUseNpm = async (root: string) => Promise.resolve(true);

/**
 * Run a package script.
 */
export const runPackageScript = async (command: string, useYarn: boolean, cwd: string) =>
  new Promise<boolean>((resolvePromise) => {
    try {
      execSync(`${useYarn ? 'yarn' : 'npm run'} ${command}`, {cwd, stdio: 'inherit'});
      resolvePromise(true);
    } catch (e) {
      resolvePromise(false);
    }
  });

/**
 * @internal
 */
const targets = new Map<string, CompilerTargetHandler>();

/**
 * Retrieves the set of available targets.
 */
export const getTargets = async (): Promise<Map<string, CompilerTargetHandler>> => {
  if (targets.size > 0) {
    return targets;
  }

  for (const [plugin, configuration] of await findPlugins()) {
    if (!configuration.compiler || !configuration.compiler.targetProviders) {
      continue;
    }

    for (const path of configuration.compiler.targetProviders) {
      const provider = require(join(plugin, path)) as CompilerTargetProvider;
      targets.set(provider.name, provider.handler);
    }
  }

  return targets;
};

/**
 * @internal
 */
const hashPrefab = (target: string, source: string, componentName: string) => `${target}|${source}|${componentName}`;

const prefabLocations = new Map<string, string>();

/**
 * @internal
 */
const getPrefabLocation = async (
  target: string,
  source: string,
  componentName: string,
): Promise<string | undefined> => {
  const hash = hashPrefab(target, source, componentName);
  if (prefabLocations.size > 0) {
    return prefabLocations.get(`${target}|${source}|${componentName}`);
  }

  for (const [plugin, configuration] of await findPlugins()) {
    if (!configuration.compiler || !configuration.compiler.prefabs) {
      continue;
    }

    for (const pluginTarget in configuration.compiler.prefabs) {
      for (const pluginSource in configuration.compiler.prefabs[pluginTarget]) {
        for (const pluginComponentName in configuration.compiler.prefabs[pluginTarget][pluginSource]) {
          const newHash = hashPrefab(pluginTarget, pluginSource, pluginComponentName);
          if (prefabLocations.has(newHash)) {
            fatalError(`Found duplicate prefab compilation instructions for target ${pluginTarget}. Component name: ${pluginComponentName}. Component source: ${pluginSource}.`);
          }
          prefabLocations.set(
            newHash,
            join(plugin, configuration.compiler.prefabs[pluginTarget][pluginSource][pluginComponentName]),
          );
        }
      }
    }
  }

  return prefabLocations.get(hash);
};

/**
 * @internal
 */
const prefabs = new Map<string, any>();

export const getPrefab = async <T>(
  target: string,
  source: string,
  componentName: string,
): Promise<T | undefined> => {
  const hash = hashPrefab(target, source, componentName);
  if (prefabs.has(hash)) {
    return prefabs.get(hash);
  }
  const location = await getPrefabLocation(target, source, componentName);
  if (!location) {
    prefabs.set(hash, undefined);
    return undefined;
  }

  try {
    const prefab = require(location) as T;
    prefabs.set(hash, prefab);
    return prefab;
  } catch (e) {
    warning(`A prefab for ${componentName} was specified in package.json, but could not be loaded.`);
    prefabs.set(hash, undefined);
    return undefined;
  }
};

/**
 * Retrieves a valid project suitable as a component source for a compiler target.
 *
 * @param projectRoot - The directory expected to contain a valid project.
 */
export const getValidProject = (projectRoot: string): Project => {
  const tsConfigFilePath = findConfigFile(projectRoot, sys.fileExists, 'tsconfig.json')!;
  if (!tsConfigFilePath) {
    throw new Error('Unable to proceed: TypeScript configuration not found.');
  }
  const mainFilePath = join(projectRoot, 'src', 'index.ts');
  const packageJsonFilePath = join(projectRoot, 'package.json');
  if (!existsSync(tsConfigFilePath)) {
    throw new Error(`Unable to proceed: tsconfig.json not found at ${tsConfigFilePath}`);
  }
  if (!existsSync(mainFilePath)) {
    throw new Error(`Unable to proceed: no main file found at ${mainFilePath}`);
  }
  if (!existsSync(packageJsonFilePath)) {
    throw new Error(`Unable to proceed: no package.json file found at ${packageJsonFilePath}`);
  }

  const tsConfig = readJsonSync(tsConfigFilePath, {throws: false}) as {compilerOptions: CompilerOptions};
  if (
    !tsConfig ||
    !tsConfig.compilerOptions ||
    tsConfig.compilerOptions.rootDir !== 'src'
    || tsConfig.compilerOptions.outDir !== 'lib'
  ) {
    throw new Error(`Unable to proceed: TypeScript configuration at ${tsConfigFilePath} does not compile from src/ to lib/. Please fix the TypeScript configuration and try again.`);
  }

  const packageJson = readJsonSync(packageJsonFilePath, {throws: false});
  if (!packageJson || packageJson.main !== 'lib/index.js') {
    throw new Error(`Unable to proceed: the package configuration at ${packageJsonFilePath} does not use lib/index.js as an entry point. Please fix the package configuration and try again.`);
  }

  try {
    return new Project({tsConfigFilePath});
  } catch (e) {
    throw new Error(
      `Found an invalid TypeScript configuration at ${tsConfigFilePath}. Please check its contents and try again.`,
    );
  }
};

/**
 * An internal map from filenames to component sources from node_modules.
 * @internal
 */
const nodeModulesSourceMap = new Map<string, string>();

/**
 * Caches and returns a component's source from node_modules, based on its file path.
 */
export const getNodeModulesSource = (filePath: string): string | undefined => {
  if (nodeModulesSourceMap.has(filePath)) {
    return nodeModulesSourceMap.get(filePath);
  }
  const [maybeNamespace, maybePackageName] = filePath.replace(new RegExp(`^.*node_modules${sep}?`), '').split('/');
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
 * Processes a component type and attaches it to a preconstructed target component map.
 *
 * @param checker - A typechecker for a valid project root.
 * @param type - The type to process.
 * @param targetComponents - A preconstructed target component map to update with the results of our processing.
 * @param componentDeclaration - A class declaration which should provide the base class for every component.
 *
 * @returns `true` if we were able to process the type as a component.
 */
export const processType = (
  checker: TypeChecker,
  type: Type,
  componentDeclaration: ClassDeclaration,
  targetComponents: NamedComponentMap,
): boolean => {
  const typeSymbol = type.getSymbol();
  if (!type.isObject() || !typeSymbol) {
    return false;
  }

  const typeValue = typeSymbol.getValueDeclaration() as ClassDeclaration;
  if (!ts.isClassDeclaration(typeValue.compilerNode)) {
    // FIXME: we are catching methods in this net as well, but should not.
    return false;
  }

  const componentName = typeValue.getName();
  if (!componentName) {
    // FIXME: we should be able to handle this by automatically generating anonymous componenet names.
    warning('Encountered an unnamed component class. Components without names are skipped.');
    return false;
  }

  if (
    targetComponents.has(componentName)
  ) {
    if (targetComponents.get(componentName)!.type !== type) {
      // FIXME: we should be able to handle this by automatically renaming components (e.g. `Color`, `Color0`…).
      warning(`Encountered a duplicate component name: ${componentName}. Please ensure no component names are duplicated.`);
      return false;
    }

    return true;
  }

  const newTarget: TargetComponent = {
    type,
    properties: [],
    warnings: {
      missingProperties: new Set(),
      ambiguousTypes: new Set(),
    },
  };

  if (typeValue.getBaseClass() !== componentDeclaration) {
    return false;
  }

  const sourceFile = typeValue.getSourceFile();
  if (sourceFile.isInNodeModules()) {
    newTarget.source = getNodeModulesSource(sourceFile.getFilePath());
  }

  for (const typeMember of typeSymbol.getMembers()) {
    const valueDeclaration = typeMember.getValueDeclaration() as PropertyDeclaration;
    if (!valueDeclaration) {
      // We will skip e.g. @typeparams here.
      continue;
    }
    const propertyName = valueDeclaration.getName();
    const propertyType = checker.getTypeAtLocation(valueDeclaration);
    if (propertyType.isString() || propertyType.isBoolean() || propertyType.isNumber() || propertyType.isEnum()) {
      newTarget.properties.push({name: propertyName, isComponent: false});
      continue;
    }

    if (newTarget.warnings && (propertyType.isUnknown() || propertyType.isAny())) {
      newTarget.warnings.ambiguousTypes.add(propertyName);
      continue;
    }

    if (!processType(checker, propertyType, componentDeclaration, targetComponents)) {
      continue;
    }

    const candidateSymbol = propertyType.getSymbolOrThrow();

    newTarget.properties.push({
      name: propertyName,
      isComponent: true,
      type: candidateSymbol.getName(),
    });
  }

  targetComponents.set(componentName, newTarget);
  return true;
};

export const printWarnings = (targetComponents: NamedComponentMap) => {
  for (const [name, targetComponent] of targetComponents) {
    if (!targetComponent.warnings) {
      continue;
    }

    if (!targetComponent.warnings.missingProperties.size && !targetComponent.warnings.ambiguousTypes.size) {
      continue;
    }

    warning(`Component: ${name}`);

    if (targetComponent.warnings.missingProperties.size) {
      warning(
        '  The following properties are missing the @property decorator and are not included in transpiled outputs.');
      targetComponent.warnings.missingProperties.forEach((property) => warning(`  - ${property}`));
    }

    if (targetComponent.warnings.ambiguousTypes.size) {
      warning(
        '  The following properties are of an unknown or invalid type. Please ensure your component definition complete type annotations.');
      targetComponent.warnings.ambiguousTypes.forEach((property) => warning(`  - ${property}`));
    }
  }
};
