import {Format, Log} from '@diez/cli-core';
import {
  Compiler,
  CompilerTargetHandler,
  getAssemblerFactory,
  PrimitiveType,
  Property,
  TargetDiezComponent,
  TargetProperty,
} from '@diez/compiler-core';
import {Target} from '@diez/engine';
import {outputTemplatePackage} from '@diez/storage';
import {camelCase} from 'change-case';
import {
  copySync,
  ensureDirSync,
  outputFileSync,
  readFileSync,
  removeSync,
} from 'fs-extra';
import {compile, registerPartial} from 'handlebars';
import {v4} from 'internal-ip';
import {basename, join} from 'path';
import {sourcesPath} from '../utils';
import {AndroidBinding, AndroidDependency, AndroidOutput} from './android.api';

/**
 * The root location for source files.
 */
const coreAndroid = join(sourcesPath, 'android');

/**
 * Merges a new dependency to the existing set of dependencies.
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
 * A compiler for Android targets.
 * @noinheritdoc
 * @ignore
 */
export class AndroidCompiler extends Compiler<AndroidOutput, AndroidBinding> {
  /**
   * @abstract
   */
  protected async validateOptions () {
    // Noop; validation of options is not currently required for Android.
  }

  /**
   * @abstract
   */
  async hostname () {
    return await v4();
  }

  /**
   * @abstract
   */
  get moduleName () {
    return `diez_${this.output.projectName.replace(/-/g, '_')}`;
  }

  /**
   * @abstract
   */
  get hotComponent () {
    return require.resolve('@diez/targets/lib/targets/android.component');
  }

  /**
   * Retrieves an initializer based on a spec.
   *
   * Via recursion, produces output like `ComponentType(fieldName: "fileValue", child: ChildType())`.
   *
   * @abstract
   */
  protected collectComponentProperties (
    allProperties: (TargetProperty | undefined)[]): TargetProperty | undefined {
    const properties = allProperties.filter((property) => property !== undefined) as TargetProperty[];
    const reference = properties[0];
    if (!reference) {
      return;
    }

    return {
      ...reference,
      type: `Array<${reference.type}>`,
      initializer: `arrayOf<${reference.type}>(${properties.map((property) => property.initializer).join(', ')})`,
    };
  }

  /**
   * @abstract
   */
  protected getInitializer (targetComponent: TargetDiezComponent): string {
    const propertyInitializers: string[] = [];
    for (const property of targetComponent.properties) {
      propertyInitializers.push(property.initializer);
    }

    return `${targetComponent.type}(${propertyInitializers.join(', ')})`;
  }

  /**
   * @abstract
   */
  protected getPrimitive (property: Property, instance: any): TargetProperty | undefined {
    switch (property.type) {
      case PrimitiveType.String:
        return {
          ...property,
          type: 'String',
          initializer: `"${instance}"`,
        };
      case PrimitiveType.Number:
      case PrimitiveType.Float:
        return {
          ...property,
          type: 'Float',
          initializer: `${instance.toString()}f`,
        };
      case PrimitiveType.Int:
        return {
          ...property,
          type: 'Int',
          initializer: instance.toString(),
        };
      case PrimitiveType.Boolean:
        return {
          ...property,
          type: 'Boolean',
          initializer: instance.toString(),
        };
      default:
        Log.warning(`Unknown non-component primitive value: ${instance.toString()} with type ${property.type}`);
        return;
    }
  }

  /**
   * @abstract
   */
  protected createOutput (sdkRoot: string, projectName: string) {
    const packageName = `org.diez.${camelCase(projectName)}`;
    const packageComponents = packageName.split('.');
    return {
      sdkRoot,
      projectName,
      packageName,
      packageRoot: join(sdkRoot, 'src', 'main', 'java', ...packageComponents),
      components: new Map(),
      processedComponents: new Map(),
      sources: new Set([]),
      dependencies: new Set<AndroidDependency>(),
      assetBindings: new Map(),
      resources: new Map(),
    };
  }

  /**
   * @abstract
   */
  get staticRoot () {
    return join(this.output.sdkRoot, 'src', 'main', 'res');
  }

  /**
   * @abstract
   */
  printUsageInstructions () {
    const diez = Format.code('Diez');
    const component = Array.from(this.parser.rootComponentNames)[0];
    Log.info(`Diez module compiled to ${this.output.sdkRoot}.\n`);

    Log.info(`You can depend on ${diez} in ${Format.code('build.gradle')}:`);
    Log.code(`implementation project(':${this.moduleName}')
`);

    Log.info(`You can use ${diez} to bootstrap any of the components defined in your project.\n`);

    Log.code(`import ${this.output.packageName}.*

class MainActivity ... {
  override fun onCreate(...) {
    // ...
    Diez(
      ${component}(),
      viewGroup
    ).attach(fun(component) {
      runOnUiThread {
          // ...
      }
    })
  }
}
`);
  }

  /**
   * @abstract
   */
  clear () {
    this.output.processedComponents.clear();
    this.output.dependencies.clear();
    this.output.assetBindings.clear();
  }

  /**
   * Overrides asset writeout so we can write out raw resources compatible with Android naming requirements.
   */
  writeAssets () {
    // Write hot assets for hot mode.
    if (this.parser.hot) {
      super.writeAssets();
      return;
    }

    removeSync(this.staticRoot);
    for (const [set, bindings] of this.output.resources) {
      for (const [key, binding] of bindings) {
        const outputDir = join(this.staticRoot, set);
        const outputPath = join(outputDir, key);
        ensureDirSync(outputDir);

        if (binding.copy) {
          copySync(binding.contents as string, outputPath);
          continue;
        }

        outputFileSync(outputPath, binding.contents);
      }
    }
  }

  /**
   * @abstract
   */
  async writeSdk () {
    ensureDirSync(this.output.packageRoot);

    const builder = await getAssemblerFactory<AndroidOutput>(Target.Android);
    const assembler = builder(this.output);
    await assembler.addCoreFiles();

    const dataClassStartTemplate = readFileSync(join(coreAndroid, 'android.data-class.start.handlebars')).toString();
    registerPartial('androidDataClassStart', dataClassStartTemplate);

    const componentTemplate = readFileSync(join(coreAndroid, 'android.component.handlebars')).toString();

    // For each fixed, replace it with its simple constructor.
    for (const [type, {binding, ...targetComponent}] of this.output.processedComponents) {
      for (const property of Object.values(targetComponent.properties)) {
        if (
          property.originalType && this.parser.getComponentForTypeOrThrow(property.originalType).isFixedComponent) {
          property.initializer = `${property.type}()`;
        }
      }

      const dataClassStartTokens = {
        ...targetComponent,
        fixed: targetComponent.isRootComponent || this.parser.getComponentForTypeOrThrow(type).isFixedComponent,
        hasProperties: Object.keys(targetComponent.properties).length > 0,
      };

      const componentTokens = {
        ...dataClassStartTokens,
        packageName: this.output.packageName,
      };

      const componentBasename = `${targetComponent.type}.kt`;
      let hasComponentOverride = false;
      if (binding) {
        await Promise.all(binding.sources.map((source) => {
          const template = readFileSync(source).toString();
          const sourceBasename = basename(source);
          const bindingPath = join(this.output.packageRoot, sourceBasename);
          if (sourceBasename === componentBasename) {
            hasComponentOverride = true;
          }

          return assembler.writeFile(bindingPath, compile(template)(componentTokens));
        }));

        if (binding.dependencies) {
          for (const dependency of binding.dependencies) {
            mergeDependency(this.output.dependencies, dependency);
          }
        }
      }

      // We only need to write a component here if a binding hasn't already been written with the data class
      // implementation. This is determined by checking the name of the file to see if it matches our component name.
      if (!hasComponentOverride) {
        const sourceBasename = basename(`${targetComponent.type}.kt`);
        const bindingPath = join(this.output.packageRoot, sourceBasename);
        await assembler.writeFile(bindingPath, compile(componentTemplate)(componentTokens));
      }
    }

    const tokens = {
      packageName: this.output.packageName,
      dependencies: Array.from(this.output.dependencies),
    };

    this.writeAssets();
    return outputTemplatePackage(join(coreAndroid, 'sdk'), this.output.sdkRoot, tokens);
  }
}

/**
 * Handles Android target compilation.
 * @ignore
 */
export const androidHandler: CompilerTargetHandler = async (program) => {
  return new AndroidCompiler(program).start();
};
