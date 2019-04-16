import {code, execAsync, info, inlineCodeSnippet, isMacOS, warning} from '@diez/cli';
import {CompilerTargetHandler, getBinding, getHotPort, NamedComponentMap, serveHot} from '@diez/compiler';
import {ConcreteComponent} from '@diez/engine';
import {outputTemplatePackage} from '@diez/storage';
import {copySync, ensureDirSync, outputFileSync, readFileSync, removeSync, writeFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {dirname, join} from 'path';
import {AssetBinding, IosBinding, IosDependency} from '../api';
import {getTempFileName, loadComponentModule, sourcesPath} from '../utils';

const coreIos = join(sourcesPath, 'ios');

/**
 * Describes the complete output for a transpiled iOS target.
 */
export interface IosOutput {
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

interface IosComponentProperty {
  type: string;
  initializer: string;
  updateable: boolean;
}

interface IosComponentSpec {
  componentName: string;
  properties: {[name: string]: IosComponentProperty};
}

/**
 * Processes a component instance and updates the provided outputs.
 */
export const processComponentInstance = async (
  instance: ConcreteComponent,
  projectRoot: string,
  name: string,
  output: IosOutput,
  namedComponentMap: NamedComponentMap,
): Promise<boolean> => {
  const targetComponent = namedComponentMap.get(name);
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
      continue;
    }

    const value = instance.get(property.name);
    if (property.isComponent) {
      if (
        !property.type ||
        !await processComponentInstance(value, projectRoot, property.type, output, namedComponentMap)
      ) {
        if (targetComponent.warnings) {
          targetComponent.warnings.ambiguousTypes.add(property.name);
        }
        continue;
      }

      const propertyComponent = namedComponentMap.get(property.type)!;
      const propertyBinding = await getBinding<IosBinding<any>>('ios', propertyComponent.source || '.', property.type);
      if (propertyBinding) {
        spec.properties[property.name] = {
          type: property.type,
          initializer: propertyBinding.initializer ? propertyBinding.initializer(value) : `${property.type}()`,
          updateable: propertyBinding.updateable,
        };

        if (propertyBinding.assetsBinder) {
          try {
            await propertyBinding.assetsBinder(value, projectRoot, output.assetBindings);
          } catch (_) {
            console.error(_);
            // Noop.
          }
        }
      } else {
        // FIXME: as currently implemented, non-binding components can't take custom constructors.
        // This doesn't make sense as a restriction.
        spec.properties[property.name] = {
          type: property.type,
          initializer: `${property.type}(listener)`,
          updateable: true,
        };
      }
      continue;
    }

    switch (typeof value) {
      case 'string':
        spec.properties[property.name] = {
          type: 'String',
          initializer: `"${value}"`,
          updateable: false,
        };
        break;
      case 'number':
        spec.properties[property.name] = {
          type: 'CGFloat',
          initializer: value.toString(),
          updateable: false,
        };
        break;
      case 'boolean':
        spec.properties[property.name] = {
          type: 'Bool',
          initializer: value.toString(),
          updateable: false,
        };
        break;
      default:
        warning(`Unknown non-component primitive value: ${value.toString()}`);
        break;
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
export const iosHandler: CompilerTargetHandler = async (
  projectRoot,
  destinationPath,
  localComponentNames,
  namedComponentMap,
  devMode,
) => {
  const componentModule = await loadComponentModule(projectRoot);
  const sdkRoot = join(destinationPath, 'Diez');
  const staticRoot = join(sdkRoot, 'static');
  const output: IosOutput = {
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

  for (const componentName of localComponentNames) {
    const constructor = componentModule[componentName];
    if (!constructor) {
      warning(`Unable to resolve component instance from ${projectRoot}: ${componentName}.`);
      continue;
    }

    const componentInstance = new constructor();
    await processComponentInstance(componentInstance, projectRoot, componentName, output, namedComponentMap);
  }

  let hostname = 'localhost';
  if (isMacOS()) {
    try {
      hostname = `${await execAsync('scutil --get LocalHostName')}.local`;
    } catch (_) {
      // Noop.
    }
  }

  if (devMode) {
    const devPort = await getHotPort();
    await serveHot(
      projectRoot,
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

  info(`Diez SDK installed locally at ${join(projectRoot, 'Diez')}.\n`);

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
  let diez = Diez<${localComponentNames[0]}>()

  override func viewDidLoad() {
    super.viewDidLoad()
    diez.attach(self, subscriber: {(component: ${localComponentNames[0]}) in
      // ...
    })
  }
}
`);
};
