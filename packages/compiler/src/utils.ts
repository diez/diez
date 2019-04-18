/* tslint:disable:max-line-length */
import {execAsync, fatalError, findOpenPort, findPlugins, getCandidatePortRange, info, warning} from '@diez/cli';
import {execSync} from 'child_process';
import {existsSync} from 'fs';
import {readJsonSync} from 'fs-extra';
import {join, sep} from 'path';
import {ClassDeclaration, Project, PropertyDeclaration, ts, Type} from 'ts-morph';
import {CompilerOptions, findConfigFile, sys} from 'typescript';
import {CompilerProgram, CompilerTargetHandler, CompilerTargetProvider, NamedComponentMap, TargetComponent} from './api';

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

  for (const [plugin, {providers}] of await findPlugins()) {
    if (!providers || !providers.targets) {
      continue;
    }

    for (const path of providers.targets) {
      const provider = require(join(plugin, path)) as CompilerTargetProvider;
      const providerName = provider.name.toLowerCase();
      if (targets.has(providerName)) {
        fatalError(`A target named ${providerName} is already registered.`);
      }
      targets.set(providerName, provider.handler);
    }
  }

  return targets;
};

/**
 * @internal
 */
const hashComponent = (source: string, componentName: string) => `${source}:${componentName}`;
const hashBinding = (target: string, source: string, componentName: string) => `${target}|${hashComponent(source, componentName)}`;

const bindingLocations = new Map<string, string>();

/**
 * @internal
 */
const getBindingLocation = async (
  target: string,
  source: string,
  componentName: string,
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
          join(plugin, bindings[componentHash][targetName]),
        );
      }
    }
  }

  return bindingLocations.get(hash);
};

/**
 * @internal
 */
const resolvedBindings = new Map<string, any>();

/**
 * Retrieves a binding for a given target and component source.
 */
export const getBinding = async <T>(
  target: string,
  source: string,
  componentName: string,
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
    warning(`A binding for ${componentName} was specified in package.json, but could not be loaded.`);
    resolvedBindings.set(hash, undefined);
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
 * Retrieves a valid program for a compiler run.
 *
 * @param projectRoot - The directory expected to contain a valid project.
 * @param destinationPath - The output destination for the compiler.
 * @param devMode - Whether the compiler is running in dev mode.
 */
export const getValidProgram = async (projectRoot: string, destinationPath: string, devMode: boolean): Promise<CompilerProgram> => {
  info(`Validating project structure at ${projectRoot}...`);
  const project = getValidProject(projectRoot);
  info('Compiling TypeScript sources...');
  const compilationSucceeded = await runPackageScript('tsc', await shouldUseYarn(), projectRoot);
  if (!compilationSucceeded) {
    fatalError('Unable to compile project.');
  }

  // Create a stub type file for typing the class
  const stubTypeFile = project.createSourceFile(
    'src/__stub.ts',
    "import {Component, Integer, Float} from '@diez/engine';",
  );

  const checker = project.getTypeChecker();
  const [componentImport, intImport, floatImport] = stubTypeFile.getImportDeclarationOrThrow('@diez/engine').getNamedImports();
  return {
    checker,
    project,
    projectRoot,
    destinationPath,
    devMode,
    targetComponents: new Map(),
    componentDeclaration: checker.getTypeAtLocation(componentImport).getSymbolOrThrow().getValueDeclarationOrThrow() as ClassDeclaration,
    types: {
      int: intImport.getSymbolOrThrow().getDeclaredType(),
      float: floatImport.getSymbolOrThrow().getDeclaredType(),
    },
    localComponentNames: [],
  };
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
 * @param type - The type to process.
 * @param program - The compiler program.
 *
 * @returns `true` if we were able to process the type as a component.
 */
export const processType = (type: Type, program: CompilerProgram): boolean => {
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
    program.targetComponents.has(componentName)
  ) {
    if (program.targetComponents.get(componentName)!.type !== type) {
      // FIXME: we should be able to handle this by automatically renaming components (e.g. `Color`, `Color0`…).
      warning(`Encountered a duplicate component name: ${componentName}. Please ensure no component names are duplicated.`);
      return false;
    }

    return true;
  }

  if (typeValue.getBaseClass() !== program.componentDeclaration) {
    return false;
  }

  const newTarget: TargetComponent = {
    type,
    properties: [],
    warnings: {
      missingProperties: new Set(),
      ambiguousTypes: new Set(),
    },
  };

  for (const typeMember of typeSymbol.getMembers()) {
    const valueDeclaration = typeMember.getValueDeclaration() as PropertyDeclaration;
    if (!valueDeclaration) {
      // We will skip e.g. @typeparams here.
      continue;
    }
    const propertyName = valueDeclaration.getName();
    let propertyType = program.checker.getTypeAtLocation(valueDeclaration);

    // Process array type depth.
    // TODO: support tuples and other iterables.
    let depth = 0;
    while (propertyType && propertyType.isArray()) {
      depth++;
      propertyType = propertyType.getArrayType()!;
    }

    if (!propertyType || propertyType.isUnknown() || propertyType.isAny()) {
      if (newTarget.warnings) {
        newTarget.warnings!.ambiguousTypes.add(propertyName);
      }
      continue;
    }

    if (propertyType.isString() || propertyType.isBoolean()) {
      newTarget.properties.push({depth, name: propertyName, isComponent: false, type: propertyType.getText()});
      continue;
    }

    if (propertyType === program.types.int) {
      newTarget.properties.push({depth, name: propertyName, isComponent: false, type: 'int'});
      continue;
    }

    if (propertyType === program.types.float || propertyType.isNumber()) {
      newTarget.properties.push({depth, name: propertyName, isComponent: false, type: 'float'});
      continue;
    }

    if (propertyType.isEnum()) {
      // TODO: should we support numeric enums?
      newTarget.properties.push({depth, name: propertyName, isComponent: false, type: 'enum'});
      continue;
    }

    // TODO: deal with propertyType.isUnion().
    if (propertyType.isUnion()) {
      // The type system cannot tolerate non-primitive union types not handled above.
      if (newTarget.warnings) {
        newTarget.warnings!.ambiguousTypes.add(propertyName);
      }
      continue;
    }

    if (!processType(propertyType, program)) {
      continue;
    }

    const candidateSymbol = propertyType.getSymbolOrThrow();

    newTarget.properties.push({
      depth,
      name: propertyName,
      isComponent: true,
      type: candidateSymbol.getName(),
    });
  }

  const sourceFile = typeValue.getSourceFile();
  if (sourceFile.isInNodeModules()) {
    newTarget.source = getNodeModulesSource(sourceFile.getFilePath());
  }

  program.targetComponents.set(componentName, newTarget);
  return true;
};

/**
 * Prints all warnings encountered while processing a target component.
 */
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
        '  The following properties are of an unknown or invalid type. Please ensure your component definition includes complete type annotations.');
      targetComponent.warnings.ambiguousTypes.forEach((property) => warning(`  - ${property}`));
    }
  }
};

/**
 * Gets a hot port in the range 8080-8180 for hot serving Diez projects.
 */
export const getHotPort = async () => findOpenPort(getCandidatePortRange(8080, 100));
