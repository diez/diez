import {code, execAsync, info, inlineCodeSnippet, isMacOS, warning} from '@diez/cli';
import {
  CompilerProgram,
  CompilerTargetHandler,
  getBinding,
  getHotPort,
  MaybeNestedArray,
  serveHot,
  TargetComponent,
  TargetProperty,
} from '@diez/compiler';
import {ConcreteComponent} from '@diez/engine';
import {outputTemplatePackage} from '@diez/storage';
import {copySync, ensureDirSync, outputFileSync, readFileSync, removeSync, writeFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {dirname, join} from 'path';
import {AssetBinding, IosBinding, IosComponentProperty, IosComponentSpec, IosDependency} from '../api';
import {getTempFileName, loadComponentModule, sourcesPath} from '../utils';

const coreIos = join(sourcesPath, 'ios');

/**
 * Describes the complete output for a transpiled iOS target.
 */
export interface IosOutput {
  program: CompilerProgram;
  processedComponents: Set<string>;
  imports: Set<string>;
  sources: Set<string>;
  dependencies: Set<IosDependency>;
  assetBindings: Map<string, AssetBinding>;
}

const mergeDependency = (dependencies: Set<IosDependency>, newDependency: IosDependency) => {
  for (const dependency of dependencies) {
    if (dependency.cocoapods.name === newDependency.cocoapods.name) {
      // TODO: check for conflicts.
      return;
    }
  }

  dependencies.add(newDependency);
};

const mergeBindingToOutput = (output: IosOutput, binding: IosBinding<any>) => {
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

const collectComponentProperties = (
  allProperties: (IosComponentProperty | undefined)[],
): IosComponentProperty | undefined => {
  const properties = allProperties.filter((property) => property !== undefined) as IosComponentProperty[];
  const reference = properties[0];
  if (!reference) {
    return;
  }

  return {
    type: `[${reference.type}]`,
    initializer: `[${properties.map((property) => property.initializer).join(', ')}]`,
    updateable: reference.updateable,
  };
};

const processComponentProperty = async (
  property: TargetProperty,
  instance: MaybeNestedArray<any>,
  targetComponent: TargetComponent,
  output: IosOutput,
): Promise<IosComponentProperty | undefined> => {
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
    const propertyBinding = await getBinding<IosBinding<any>>('ios', propertyComponent.source || '.', property.type);
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
        updateable: propertyBinding.updateable,
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
        type: 'CGFloat',
        initializer: instance.toString(),
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
        type: 'Bool',
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
  output: IosOutput,
): Promise<boolean> => {
  const targetComponent = output.program.targetComponents.get(name);
  if (!targetComponent) {
    warning(`Unable to find component definition for ${name}!`);
    return false;
  }

  const isFirstPass = !output.processedComponents.has(name);

  // Add sources etc. if we're looking at a binding.
  const binding = await getBinding<IosBinding<any>>('ios', targetComponent.source || '.', name);
  if (binding && isFirstPass) {
    mergeBindingToOutput(output, binding);
  }

  const spec: IosComponentSpec = {componentName: name, properties: {}};

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
      compile(readFileSync(join(coreIos, 'ios.component.handlebars')).toString())(spec),
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
  output: IosOutput,
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

  outputTemplatePackage(join(coreIos, 'sdk'), sdkRoot, tokens);
};

/**
 * The canonical iOS compiler target implementation.
 */
export const iosHandler: CompilerTargetHandler = async (program) => {
  const componentModule = await loadComponentModule(program.projectRoot);
  const sdkRoot = join(program.destinationPath, 'Diez');
  const staticRoot = join(sdkRoot, 'static');
  const output: IosOutput = {
    program,
    processedComponents: new Set(),
    imports: new Set(['Foundation', 'WebKit']),
    sources: new Set([
      join(coreIos, 'Diez.swift'),
      join(coreIos, 'Environment.swift'),
      join(coreIos, 'Serialization.swift'),
    ]),
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

  let hostname = 'localhost';
  if (isMacOS()) {
    try {
      hostname = `${await execAsync('scutil --get LocalHostName')}.local`;
    } catch (_) {
      // Noop.
    }
  }

  if (program.devMode) {
    const devPort = await getHotPort();
    await serveHot(
      program.projectRoot,
      require.resolve('@diez/targets/lib/ios/ios.component'),
      devPort,
      staticRoot,
    );
    writeSdk(output, sdkRoot, staticRoot, true, hostname, devPort);
    // TODO: watch for hot updates and update the SDK when things change.
    // TODO: when we shut down, compile once in prod mode.
  } else {
    writeSdk(output, sdkRoot, staticRoot, false, hostname);
  }

  info(`Diez SDK installed locally at ${join(program.projectRoot, 'Diez')}.\n`);

  // TODO: Check if the target is actually using CocoaPods; locate Podfile if they are.
  // TODO: Offer to add dependency to CocoaPods for the user, but don't force them to accept.
  // Check if they already have a pod dependency.
  info(`You can depend on the Diez SDK in your ${inlineCodeSnippet('Podfile')} like so:`);
  code('pod \'Diez\', :path => \'./Diez\'\n');
  info(`Don't forget to run ${inlineCodeSnippet('pod install')} after updating your CocoaPods dependencies!\n`);

  // TODO: Check if the target is actually using Swift.
  info(`You can use ${inlineCodeSnippet('Diez')} to bootstrap any of the components defined in your project.\n`);
  info('For example:');
  // TODO: Move this into a template.
  // TODO: components with bindings should yield their own documentation.
  code(`import UIKit
import Diez

class ViewController: UIViewController {
  let diez = Diez<${program.localComponentNames[0]}>()

  override func viewDidLoad() {
    super.viewDidLoad()
    diez.attach(self, subscriber: {(component: ${program.localComponentNames[0]}) in
      // ...
    })
  }
}
`);
};
