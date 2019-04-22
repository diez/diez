import {warning} from '@diez/cli';
import {
  CompilerTargetHandler,
  getBinding,
  getHotPort,
  PrimitiveType,
  PropertyType,
  serveHot,
  TargetCompiler,
  TargetComponent,
  TargetComponentProperty,
  TargetComponentSpec,
  TargetProperty,
} from '@diez/compiler';
import {outputTemplatePackage} from '@diez/storage/lib';
import {copySync, readFileSync, writeFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {v4} from 'internal-ip';
import {basename, join} from 'path';
import {getTempFileName, isLocalType, sourcesPath} from '../utils';
import {AndroidBinding, AndroidDependency, AndroidOutput} from './android.api';

/**
 * The root location for source files.
 *
 * @internal
 */
const coreAndroid = join(sourcesPath, 'android');

/**
 * Retrieves an initializer based on a spec.
 *
 * Via recursion, produces output like `ComponentType(fieldName: "fileValue", child: ChildType())`.
 *
 * @internal
 */
const getInitializer = (
  spec: TargetComponentSpec,
) => {
  const propertyInitializers: string[] = [];
  for (const name in spec.properties) {
    propertyInitializers.push(spec.properties[name].initializer);
  }

  return `${spec.componentName}(${propertyInitializers.join(', ')})`;
};

/**
 * Merges a new dependency to the existing set of dependencies.
 *
 * @internal
 */
const mergeDependency = (dependencies: Set<AndroidDependency>, newDependency: AndroidDependency) => {
  for (const dependency of dependencies) {
    if (dependency.gradle.source === newDependency.gradle.source) {
      // TODO: check for conflicts.
      return;
    }
  }

  dependencies.add(newDependency);
};

/**
 * Reducer for array component properties.
 */
const collectComponentProperties = (
  allProperties: (TargetComponentProperty | undefined)[],
): TargetComponentProperty | undefined => {
  const properties = allProperties.filter((property) => property !== undefined) as TargetComponentProperty[];
  const reference = properties[0];
  if (!reference) {
    return;
  }

  return {
    type: `Array<${reference.type}>`,
    initializer: `arrayOf<${reference.type}>(${properties.map((property) => property.initializer).join(', ')})`,
    updateable: reference.updateable,
  };
};

const getPrimitive = (type: PropertyType, instance: any): TargetComponentProperty | undefined => {
  switch (type) {
    case PrimitiveType.String:
      return {
        type: 'String',
        initializer: `"${instance}"`,
        updateable: false,
      };
    case PrimitiveType.Number:
    case PrimitiveType.Float:
      return {
        type: 'Float',
        initializer: `${instance.toString()}F`,
        updateable: false,
      };
    case PrimitiveType.Int:
      return {
        type: 'Int',
        initializer: instance.toString(),
        updateable: false,
      };
    case PrimitiveType.Boolean:
      return {
        type: 'Boolean',
        initializer: instance.toString(),
        updateable: false,
      };
    default:
      warning(`Unknown non-component primitive value: ${instance.toString()} with type ${type}`);
      return;
  }
};

/**
 * A compiler for iOS targets.
 */
export class AndroidCompiler extends TargetCompiler<
  AndroidOutput,
  TargetComponentSpec,
  TargetComponentProperty,
  AndroidBinding
> {
  /**
   * @abstract
   */
  protected targetName = 'android';

  /**
   * @abstract
   */
  protected createSpec (type: PropertyType) {
    return {componentName: type, properties: {}, public: isLocalType(type, this.program)};
  }

  /**
   * @abstract
   */
  protected mergeBindingToOutput (binding: AndroidBinding): void {
    for (const bindingSource of binding.sources) {
      this.output.files.set(basename(bindingSource), bindingSource);
    }

    if (binding.dependencies) {
      for (const dependency of binding.dependencies) {
        mergeDependency(this.output.dependencies, dependency);
      }
    }
  }

  /**
   * @abstract
   */
  protected createOutput (sdkRoot: string) {
    return {
      sdkRoot,
      files: new Map([
        ['Diez.kt', join(coreAndroid, 'core', 'Diez.kt')],
        ['Environment.kt', join(coreAndroid, 'core', 'Environment.kt')],
      ]),
      processedComponents: new Map(),
      imports: new Set([]),
      sources: new Set([]),
      dependencies: new Set(),
      assetBindings: new Map(),
    };
  }

  /**
   * @abstract
   */
  get staticRoot () {
    return join(this.output.sdkRoot, 'src', 'main', 'assets');
  }

  /**
   * @abstract
   */
  printUsageInstructions () {
    // TODO.
  }

  /**
   * @abstract
   */
  clear () {
    this.output.sources.clear();
    this.output.processedComponents.clear();
    this.output.dependencies.clear();
    this.output.assetBindings.clear();
  }

  /**
   * @abstract
   */
  protected async processComponentProperty (
    property: TargetProperty,
    instance: any,
    serializedInstance: any,
    targetComponent: TargetComponent,
  ): Promise<TargetComponentProperty | undefined> {
    if (Array.isArray(instance)) {
      if (!property.depth) {
        // This should never happen.
        targetComponent.warnings.ambiguousTypes.add(property.name);
        return;
      }

      return collectComponentProperties(await Promise.all(instance.map(async (child, index) =>
        this.processComponentProperty(property, child, serializedInstance[index], targetComponent),
      )));
    }

    if (property.isComponent) {
      const componentSpec = await this.processComponentInstance(instance, property.type);
      if (!componentSpec) {
        targetComponent.warnings.ambiguousTypes.add(property.name);
        return;
      }

      const propertyComponent = this.program.targetComponents.get(property.type)!;
      const propertyBinding = await getBinding<AndroidBinding>(
        this.targetName, propertyComponent.source || '.', property.type);
      if (propertyBinding) {
        if (propertyBinding.assetsBinder) {
          try {
            await propertyBinding.assetsBinder(instance, this.program.projectRoot, this.output.assetBindings);
          } catch (error) {
            warning(error);
          }
        }
      }

      return {
        type: property.type,
        updateable: true,
        initializer: getInitializer(componentSpec),
      };
    }

    return getPrimitive(property.type, serializedInstance);
  }

  /**
   * @abstract
   */
  async writeSdk (hostname?: string, devPort?: number) {
    // Pass through to take note of our singletons.
    const singletons = new Set<PropertyType>();
    for (const [type, {instances, binding}] of this.output.processedComponents) {
      // If a binding is provided, it's safe to assume we don't want to treat this object as a singleton, even if it is.
      if (instances.size === 1 && !binding) {
        singletons.add(type);
      }
    }

    const componentTemplate = readFileSync(join(coreAndroid, 'android.component.handlebars')).toString();
    for (const [type, {spec, binding}] of this.output.processedComponents) {
      if (binding && binding.skipGeneration) {
        this.mergeBindingToOutput(binding);
        continue;
      }

      // For each singleton, replace it with its simple constructor.
      for (const property of Object.values(spec.properties)) {
        if (singletons.has(property.type)) {
          property.initializer = `${property.type}()`;
        }
      }

      const filename = getTempFileName();
      this.output.sources.add(filename);
      writeFileSync(
        filename,
        compile(componentTemplate)({
          ...spec,
          singleton: spec.public || singletons.has(type),
        }),
      );

      if (binding) {
        this.mergeBindingToOutput(binding);
      }
    }

    for (const [filename, source] of this.output.files) {
      copySync(source, join(this.output.sdkRoot, 'src', 'main', 'java', 'org', 'diez', filename));
    }

    const tokens = {
      devPort,
      hostname,
      devMode: this.program.devMode,
      dependencies: Array.from(this.output.dependencies),
      sources: Array.from(this.output.sources).map((source) => readFileSync(source).toString()),
    };

    this.writeAssets();
    outputTemplatePackage(join(coreAndroid, 'sdk'), this.output.sdkRoot, tokens);
  }
}

/**
 * The canonical Android compiler target implementation.
 */
export const androidHandler: CompilerTargetHandler = async (program) => {
  const sdkRoot = join(program.destinationPath, 'diez');
  const compiler = new AndroidCompiler(program, sdkRoot);

  if (program.devMode) {
    const hostname = await v4();
    const devPort = await getHotPort();
    await compiler.runHot(async () => {
      await compiler.writeSdk(hostname, devPort);
    });

    await serveHot(
      program.projectRoot,
      require.resolve('@diez/targets/lib/targets/android.component'),
      devPort,
      compiler.staticRoot,
    );
  } else {
    await compiler.run();
    await compiler.writeSdk();
  }

  compiler.printUsageInstructions();
};
