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
import {readFileSync, writeFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {v4} from 'internal-ip';
import {join} from 'path';
import {getTempFileName, sourcesPath} from '../utils';
import {WebBinding, WebDependency, WebOutput} from './web.api';

/**
 * The root location for source files.
 *
 * @internal
 */
const coreWeb = join(sourcesPath, 'web');

/**
 * Retrieves an initializer based on a spec.
 *
 * Via recursion, produces output like `new ComponentType({fieldName: "fileValue", child: new ChildType()})`.
 *
 * @internal
 */
const getInitializer = (
  spec: TargetComponentSpec,
) => {
  const propertyInitializers: string[] = [];
  for (const name in spec.properties) {
    propertyInitializers.push(`${name}: ${spec.properties[name].initializer}`);
  }

  return `new ${spec.componentName}({${propertyInitializers.join(', ')}})`;
};

/**
 * Merges a new dependency to the existing set of dependencies.
 *
 * @internal
 */
const mergeDependency = (dependencies: Set<WebDependency>, newDependency: WebDependency) => {
  for (const dependency of dependencies) {
    if (dependency.packageJson.name === newDependency.packageJson.name) {
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
    type: `${reference.type}[]`,
    initializer: `[${properties.map((property) => property.initializer).join(', ')}]`,
    updateable: reference.updateable,
  };
};

const getPrimitive = (type: PropertyType, instance: any): TargetComponentProperty | undefined => {
  switch (type) {
    case PrimitiveType.String:
      return {
        type: 'string',
        initializer: `"${instance}"`,
        updateable: false,
      };
    case PrimitiveType.Number:
    case PrimitiveType.Float:
    case PrimitiveType.Int:
      return {
        type: 'number',
        initializer: instance.toString(),
        updateable: false,
      };
    case PrimitiveType.Boolean:
      return {
        type: 'boolean',
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
export class WebCompiler extends TargetCompiler<WebOutput, WebBinding> {
  /**
   * @abstract
   */
  protected targetName = 'web';

  /**
   * @abstract
   */
  protected mergeBindingToOutput (binding: WebBinding): void {
    for (const bindingSource of binding.sources) {
      this.output.sources.add(bindingSource);
    }

    if (binding.declarations) {
      for (const declaration of binding.declarations) {
        this.output.declarations.add(declaration);
      }
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
      sources: new Set([
        join(coreWeb, 'core', 'Diez.js'),
      ]),
      declarations: new Set([
        join(coreWeb, 'core', 'Diez.d.ts'),
      ]),
      dependencies: new Set(),
      assetBindings: new Map(),
    };
  }

  /**
   * @abstract
   */
  get staticRoot () {
    return join(this.output.sdkRoot, 'static');
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
    this.output.declarations.clear();
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
      const propertyBinding = await getBinding<WebBinding>(
        this.targetName, propertyComponent.source || '.', property.type);
      if (propertyBinding) {
        if (propertyBinding.assetsBinder) {
          try {
            await propertyBinding.assetsBinder(instance, this.program.projectRoot, this.output);
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

    const componentTemplate = readFileSync(join(coreWeb, 'web.component.handlebars')).toString();
    const declarationTemplate = readFileSync(join(coreWeb, 'web.declaration.handlebars')).toString();
    for (const [type, {spec, binding}] of this.output.processedComponents) {
      if (binding && binding.skipGeneration) {
        this.mergeBindingToOutput(binding);
        continue;
      }

      // For each singleton, replace it with its simple constructor.
      for (const property of Object.values(spec.properties)) {
        if (singletons.has(property.type)) {
          property.initializer = `new ${property.type}()`;
        }
      }

      const sourceFilename = getTempFileName();
      this.output.sources.add(sourceFilename);
      writeFileSync(
        sourceFilename,
        compile(componentTemplate)({
          ...spec,
          singleton: spec.public || singletons.has(type),
        }),
      );

      if (binding) {
        this.mergeBindingToOutput(binding);
      }

      if (binding && binding.declarations && binding.declarations.length) {
        continue;
      }

      const declarationFilename = getTempFileName();
      this.output.declarations.add(declarationFilename);
      writeFileSync(
        declarationFilename,
        compile(declarationTemplate)(spec),
      );
    }

    const tokens = {
      devPort,
      hostname,
      devMode: this.program.devMode,
      dependencies: Array.from(this.output.dependencies),
      sources: Array.from(this.output.sources).map((source) => readFileSync(source).toString()),
      declarations: Array.from(this.output.declarations).map((source) => readFileSync(source).toString()),
    };

    this.writeAssets();
    outputTemplatePackage(join(coreWeb, 'sdk'), this.output.sdkRoot, tokens);
  }
}

/**
 * The canonical Web compiler target implementation.
 */
export const webHandler: CompilerTargetHandler = async (program) => {
  const sdkRoot = join(program.destinationPath, 'diez');
  const compiler = new WebCompiler(program, sdkRoot);

  if (program.devMode) {
    const hostname = await v4();
    const devPort = await getHotPort();
    await compiler.runHot(async () => {
      await compiler.writeSdk(hostname, devPort);
    });

    await serveHot(
      program.projectRoot,
      require.resolve('@diez/targets/lib/targets/web.component'),
      devPort,
      compiler.staticRoot,
    );
  } else {
    await compiler.run();
    await compiler.writeSdk();
  }

  compiler.printUsageInstructions();
};
