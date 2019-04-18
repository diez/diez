import {warning} from '@diez/cli';
import {
  CompilerTargetHandler,
  getBinding,
  getHotPort,
  MaybeNestedArray,
  serveHot,
  TargetComponent,
  TargetProperty,
} from '@diez/compiler';
import {ConcreteComponent} from '@diez/engine';
import {outputTemplatePackage} from '@diez/storage/lib';
import {copySync, ensureDirSync, outputFileSync, readFileSync, removeSync, writeFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {v4} from 'internal-ip';
import {dirname, join} from 'path';
import {getTempFileName, loadComponentModule, sourcesPath} from '../utils';
import {AndroidBinding, AndroidComponentProperty, AndroidComponentSpec, AndroidDependency, AndroidOutput} from './android.api';

/**
 * The root location for source files.
 */
const coreAndroid = join(sourcesPath, 'android');

/**
 * Merges a new dependency to the existing set of dependencies.
 *
 * @internal
 */
const mergeDependency = (dependencies: Set<AndroidDependency>, newDependency: AndroidDependency) => {
  // TODO: check for conflicts.
  dependencies.add(newDependency);
};

/**
 * Merges an iOS binding to existing output.
 *
 * @internal
 */
const mergeBindingToOutput = (output: AndroidOutput, binding: AndroidBinding<any>) => {
  for (const bindingImport of binding.imports) {
    output.imports.add(bindingImport);
  }

  for (const bindingSource of binding.sources) {
    output.sources.add(bindingSource);
  }

  if (binding.dependencies) {
    for (const dependency of binding.dependencies) {
      mergeDependency(output.dependencies, dependency);
    }
  }
};

/**
 * Reducer for array component properties.
 *
 * TODO: define what should actually happen here.
 */
const collectComponentProperties = (
  allProperties: (AndroidComponentProperty | undefined)[],
): AndroidComponentProperty | undefined => {
  return;
};

const processComponentProperty = async (
  property: TargetProperty,
  instance: MaybeNestedArray<any>,
  targetComponent: TargetComponent,
  output: AndroidOutput,
): Promise<AndroidComponentProperty | undefined> => {
  if (Array.isArray(instance)) {
    if (!property.depth) {
      // This should never happen.
      if (targetComponent.warnings) {
        targetComponent.warnings.ambiguousTypes.add(property.name);
        return;
      }
    }

    return collectComponentProperties(await Promise.all(instance.map(async (child) => processComponentProperty(
      property,
      child,
      targetComponent,
      output,
    ))));
  }

  if (property.isComponent) {
    if (
      !property.type ||
      !await processComponentInstance(instance, property.type, output)
    ) {
      if (targetComponent.warnings) {
        targetComponent.warnings.ambiguousTypes.add(property.name);
      }
      return;
    }

    const propertyComponent = output.program.targetComponents.get(property.type)!;
    const propertyBinding = await getBinding<AndroidBinding<any>>(
      'android', propertyComponent.source || '.', property.type);
    if (propertyBinding) {
      if (propertyBinding.assetsBinder) {
        try {
          await propertyBinding.assetsBinder(instance, output.program.projectRoot, output.assetBindings);
        } catch (_) {
          console.error(_);
          // Noop.
        }
      }

      return {
        type: property.type,
        initializer: propertyBinding.initializer ? propertyBinding.initializer(instance) : `${property.type}()`,
        // FIXME: this doesn't actually do anything right now.
        updateable: true,
      };
    }
    // FIXME: as currently implemented, components without bindings can't take custom constructors.
    // This doesn't make sense as a restriction.
    return {
      type: property.type,
      initializer: `${property.type}(listener)`,
      updateable: true,
    };
  }

  switch (property.type) {
    case 'string':
      return {
        type: 'String',
        initializer: `"${instance}"`,
        updateable: false,
      };
    case 'number':
    case 'float':
      return {
        type: 'Float',
        initializer: `${instance.toString()}F`,
        updateable: false,
      };
    case 'int':
      return {
        type: 'Int',
        initializer: instance.toString(),
        updateable: false,
      };
    case 'boolean':
      return {
        type: 'Boolean',
        initializer: instance.toString(),
        updateable: false,
      };
    default:
      warning(`Unknown non-component primitive value: ${instance.toString()} with type ${property.type}`);
      return;
  }
};

/**
 * Processes a component instance and updates the provided outputs.
 */
export const processComponentInstance = async (
  instance: ConcreteComponent,
  name: string,
  output: AndroidOutput,
): Promise<boolean> => {
  const targetComponent = output.program.targetComponents.get(name);
  if (!targetComponent) {
    warning(`Unable to find component definition for ${name}!`);
    return false;
  }

  const isFirstPass = !output.processedComponents.has(name);

  // Add sources etc. if we're looking at a binding.
  const binding = await getBinding<AndroidBinding<any>>('android', targetComponent.source || '.', name);
  if (binding && isFirstPass) {
    mergeBindingToOutput(output, binding);
  }

  const spec: AndroidComponentSpec = {componentName: name, properties: {}};

  for (const property of targetComponent.properties) {
    if (!instance.boundStates.get(property.name)) {
      // We are looking at a property that is not a state.
      // Sadly, we can't prevent these from falling through from the AST due to the fact that property decorators are
      // not present in transpiled sources.
      continue;
    }

    const propertySpec = await processComponentProperty(
      property,
      instance.get(property.name),
      targetComponent,
      output,
    );

    if (propertySpec) {
      spec.properties[property.name] = propertySpec;
    }
  }

  if (isFirstPass && (!binding || !binding.sources.length)) {
    const filename = getTempFileName();
    writeFileSync(
      filename,
      compile(readFileSync(join(coreAndroid, 'android.component.handlebars')).toString())(spec),
    );

    output.sources.add(filename);
  }

  output.processedComponents.add(name);
  return true;
};

/**
 * Given a set of constructed iOS outputs, writes an SDK to a destination path.
 */
export const writeSdk = (
  output: AndroidOutput,
  sdkRoot: string,
  staticRoot: string,
  devMode: boolean,
  hostname?: string,
  devPort?: number,
) => {
  const tokens = {
    devMode,
    devPort,
    hostname,
    dependencies: Array.from(output.dependencies),
    imports: Array.from(output.imports),
    sources: Array.from(output.sources).map((source) => readFileSync(source).toString()),
  };

  removeSync(staticRoot);
  for (const [path, binding] of output.assetBindings) {
    const outputPath = join(staticRoot, path);
    ensureDirSync(dirname(outputPath));
    if (binding.copy) {
      copySync(binding.contents as string, outputPath);
      continue;
    }

    outputFileSync(outputPath, binding.contents);
  }

  outputTemplatePackage(join(coreAndroid, 'sdk'), sdkRoot, tokens);
};

/**
 * The canonical Android compiler target implementation.
 */
export const androidHandler: CompilerTargetHandler = async (program) => {
  const componentModule = await loadComponentModule(program.projectRoot);
  const sdkRoot = join(program.destinationPath, 'diez');
  const staticRoot = join(sdkRoot, 'src', 'main', 'assets');

  const output: AndroidOutput = {
    program,
    processedComponents: new Set(),
    imports: new Set([]),
    sources: new Set([]),
    dependencies: new Set(),
    assetBindings: new Map(),
  };

  for (const componentName of program.localComponentNames) {
    const constructor = componentModule[componentName];
    if (!constructor) {
      warning(`Unable to resolve component instance from ${program.projectRoot}: ${componentName}.`);
      continue;
    }

    const componentInstance = new constructor();
    await processComponentInstance(componentInstance, componentName, output);
  }

  if (program.devMode) {
    const devPort = await getHotPort();
    await serveHot(
      program.projectRoot,
      require.resolve('@diez/targets/lib/targets/android.component'),
      devPort,
      staticRoot,
    );
    writeSdk(output, sdkRoot, staticRoot, true, await v4(), devPort);
    // TODO: watch for hot updates and update the SDK when things change.
    // TODO: when we shut down, compile once in prod mode?
  } else {
    // TODO: write SDK in prod mode.
  }
};
