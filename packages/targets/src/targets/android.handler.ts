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
  TargetProperty,
} from '@diez/compiler';
import {outputTemplatePackage} from '@diez/storage/lib';
import {copySync, ensureDirSync, outputFileSync, readFileSync, removeSync} from 'fs-extra';
import {v4} from 'internal-ip';
import {dirname, join} from 'path';
import {isLocalType, sourcesPath} from '../utils';
import {AndroidBinding, AndroidComponentSpec, AndroidDependency, AndroidOutput} from './android.api';

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
  spec: AndroidComponentSpec,
) => {
  // TODO.
  return `${spec.componentName}()`;
};

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
 * Reducer for array component properties.
 *
 * TODO: define what should actually happen here.
 */
const collectComponentProperties = (
  allProperties: (TargetComponentProperty | undefined)[],
): TargetComponentProperty | undefined => {
  return;
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
  AndroidComponentSpec,
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
      this.output.sources.add(bindingSource);
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
    this.output.imports.clear();
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
    const tokens = {
      devPort,
      hostname,
      devMode: this.program.devMode,
      dependencies: Array.from(this.output.dependencies),
      imports: Array.from(this.output.imports),
      sources: Array.from(this.output.sources).map((source) => readFileSync(source).toString()),
    };

    removeSync(this.staticRoot);
    for (const [path, binding] of this.output.assetBindings) {
      const outputPath = join(this.staticRoot, path);
      ensureDirSync(dirname(outputPath));
      if (binding.copy) {
        copySync(binding.contents as string, outputPath);
        continue;
      }

      outputFileSync(outputPath, binding.contents);
    }

    outputTemplatePackage(join(coreAndroid, 'sdk'), this.output.sdkRoot, tokens);
  }
}

/**
 * The canonical Android compiler target implementation.
 */
export const androidHandler: CompilerTargetHandler = async (program) => {
  const sdkRoot = join(program.destinationPath, 'diez');
  const compiler = new AndroidCompiler(program, sdkRoot);
  await compiler.run();

  if (program.devMode) {
    const devPort = await getHotPort();
    await serveHot(
      program.projectRoot,
      require.resolve('@diez/targets/lib/targets/android.component'),
      devPort,
      compiler.staticRoot,
    );
    await compiler.writeSdk(await v4(), devPort);
    // TODO: watch for hot updates and update the SDK when things change.
    // TODO: when we shut down, compile once in prod mode?
  } else {
    await compiler.writeSdk();
  }

  compiler.printUsageInstructions();
};
