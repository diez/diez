import {warning} from '@livedesigner/cli';
import {CompilerTargetHandler, getPrefab, NamedComponentMap} from '@livedesigner/compiler';
import {ConcreteComponent} from '@livedesigner/engine';
import {outputTemplatePackage} from '@livedesigner/storage';
import {readFileSync, writeFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {join} from 'path';
import {IosDependency, IosPrefab} from '../api';
import {getTempFileName, loadComponentModule, sourcesPath} from '../utils';

const coreIos = join(sourcesPath, 'ios');

interface IosOutput {
  imports: Set<string>;
  sources: Set<string>;
  dependencies: Set<IosDependency>;
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

const mergePrefabToOutput = (output: IosOutput, prefab: IosPrefab) => {
  for (const prefabImport of prefab.imports) {
    output.imports.add(prefabImport);
  }

  for (const prefabSource of prefab.sources) {
    output.sources.add(prefabSource);
  }

  if (prefab.dependencies) {
    for (const dependency of prefab.dependencies) {
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

interface ComponentWarnings {
  missingProperties: string[];
  ambiguousTypes: string[];
}

const processComponentInstance = async (
  instance: ConcreteComponent,
  name: string,
  output: IosOutput,
  namedComponentMap: NamedComponentMap,
): Promise<boolean> => {
  const targetComponent = namedComponentMap.get(name);
  if (!targetComponent) {
    warning(`Unable to find component definition for ${name}!`);
    return false;
  }

  // Add sources etc. if we're looking at a prefab.
  const prefab = await getPrefab<IosPrefab>('ios', targetComponent.source || '.', name);
  if (prefab) {
    mergePrefabToOutput(output, prefab);
  }

  const spec: IosComponentSpec = {componentName: name, properties: {}};

  for (const property of targetComponent.properties) {
    if (!instance.boundStates.get(property.name)) {
      // This is a shared property, and shouldn't be transpiled.
      if (instance.boundShared.get(property.name)) {
        continue;
      }

      // This is neither @shared nor an actual @property.
      // Warn if this is a userland component, but we don't have to crash on this.
      if (!targetComponent.source || targetComponent.source === '.') {
        targetComponent.warnings.missingProperties.add(property.name);
      }
      continue;
    }

    const value = instance.get(property.name);
    if (property.isComponent) {
      if (!property.type || !await processComponentInstance(value, property.type, output, namedComponentMap)) {
        targetComponent.warnings.ambiguousTypes.add(property.name);
        continue;
      }

      const propertyComponent = namedComponentMap.get(property.type)!;
      const propertyPrefab = await getPrefab<IosPrefab>('ios', propertyComponent.source || '.', property.type);
      if (propertyPrefab) {
        spec.properties[property.name] = {
          type: property.type,
          initializer: propertyPrefab.initializer ? propertyPrefab.initializer(value) : `${property.type}()`,
          updateable: propertyPrefab.updateable,
        };
      } else {
        // FIXME: as currently implemented, non-prefab components can't take custom constructors.
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

  if (!prefab || !prefab.sources.length) {
    const filename = getTempFileName();
    writeFileSync(
      filename,
      compile(readFileSync(join(coreIos, 'ios.component.handlebars')).toString())(spec),
    );

    output.sources.add(filename);
  }

  return true;
};

const writeSdk = (output: IosOutput, destinationPath: string, devMode: boolean) => {
  const tokens = {
    devMode,
    devPort: 8081,
    dependencies: Array.from(output.dependencies),
    imports: Array.from(output.imports),
    sources: Array.from(output.sources).map((source) => readFileSync(source).toString()),
  };

  outputTemplatePackage(join(coreIos, 'sdk'), join(destinationPath, 'Diez'), tokens);
};

/**
 * The canonical iOS compiler target implementation.
 */
export const iosHandler: CompilerTargetHandler = async (
  projectRoot: string,
  destinationPath: string,
  localComponentNames: string[],
  namedComponentMap: NamedComponentMap,
  devMode: boolean,
) => {
  const componentModule = await loadComponentModule(projectRoot);
  const output: IosOutput = {
    imports: new Set(['Foundation', 'WebKit']),
    sources: new Set([
      join(coreIos, 'Diez.swift'),
      join(coreIos, 'Environment.swift'),
      join(coreIos, 'Serialization.swift'),
    ]),
    dependencies: new Set(),
  };

  for (const componentName of localComponentNames) {
    const constructor = componentModule[componentName];
    if (!constructor) {
      warning(`Unable to resolve component instance from ${projectRoot}: ${componentName}.`);
      continue;
    }

    const componentInstance = new constructor();
    await processComponentInstance(componentInstance, componentName, output, namedComponentMap);
  }

  writeSdk(output, destinationPath, devMode);
};
