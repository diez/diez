import {warning} from '@diez/cli-core';
import {
  CompilerTargetHandler,
  getTempFileName,
  PrimitiveType,
  PropertyType,
  TargetCompiler,
  TargetComponentProperty,
  TargetComponentSpec,
} from '@diez/compiler';
import {outputTemplatePackage} from '@diez/storage';
import {readFileSync, writeFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {v4} from 'internal-ip';
import {join} from 'path';
import {sourcesPath} from '../utils';
import {WebBinding, WebDependency, WebOutput} from './web.api';

/**
 * The root location for source files.
 *
 * @internal
 */
const coreWeb = join(sourcesPath, 'web');

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
 * Tries to guess the name of the host package.
 *
 * @internal
 */
const guessHostPackageName = (destinationPath: string) => {
  try {
    return require(join(destinationPath, 'package.json')).name;
  } catch (e) {
    return '';
  }
};

/**
 * A compiler for web targets.
 * @ignore
 */
export class WebCompiler extends TargetCompiler<WebOutput, WebBinding> {
  /**
   * @abstract
   */
  async hostname () {
    return await v4();
  }

  /**
   * @abstract
   */
  get hotComponent () {
    return require.resolve('@diez/targets/lib/targets/web.component');
  }

  /**
   * @abstract
   */
  protected collectComponentProperties (
    allProperties: (TargetComponentProperty | undefined)[],
  ): TargetComponentProperty | undefined {
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
  }

  /**
   * @abstract
   */
  protected getInitializer (spec: TargetComponentSpec<TargetComponentProperty>): string {
    const propertyInitializers: string[] = [];
    for (const name in spec.properties) {
      propertyInitializers.push(`${name}: ${spec.properties[name].initializer}`);
    }

    return `new ${spec.componentName}({${propertyInitializers.join(', ')}})`;
  }

  /**
   * @abstract
   */
  protected getPrimitive (type: PropertyType, instance: any): TargetComponentProperty | undefined {
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
  }

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
      declarationImports: new Set(),
      dependencies: new Set(),
      assetBindings: new Map(),
    };
  }

  /**
   * @abstract
   */
  get staticRoot () {
    if (this.program.options.devMode) {
      return join(this.output.sdkRoot, 'static');
    }

    return this.program.options.staticRoot || '/';
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
      baseUrl: this.program.options.baseUrl,
      hostPackageName: guessHostPackageName(this.program.options.outputPath),
      devMode: !!this.program.options.devMode,
      dependencies: Array.from(this.output.dependencies),
      sources: Array.from(this.output.sources).map((source) => readFileSync(source).toString()),
      declarations: Array.from(this.output.declarations).map((source) => readFileSync(source).toString()),
      declarationImports: Array.from(this.output.declarationImports),
    };

    this.writeAssets();
    outputTemplatePackage(join(coreWeb, 'sdk'), this.output.sdkRoot, tokens);
  }
}

/**
 * Handles web target compilation.
 * @ignore
 */
export const webHandler: CompilerTargetHandler = async (program) => {
  await new WebCompiler(program, join(program.options.outputPath, 'diez')).start();
};
