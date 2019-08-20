import {Format, Log} from '@diez/cli-core';
import {
  CompilerTargetHandler,
  PrimitiveType,
  PropertyType,
  TargetCompiler,
  TargetComponentProperty,
  TargetComponentSpec,
} from '@diez/compiler';
import {File} from '@diez/prefabs';
import {outputTemplatePackage} from '@diez/storage';
import {camelCase} from 'change-case';
import {
  copySync,
  ensureDirSync,
  outputFileSync,
  readFileSync,
  removeSync,
  writeFileSync,
} from 'fs-extra';
import {compile, registerPartial} from 'handlebars';
import {v4} from 'internal-ip';
import {basename, join} from 'path';
import {sourcesPath} from '../utils';
import {AndroidBinding, AndroidDependency, AndroidOutput} from './android.api';

/**
 * The root location for source files.
 *
 * @internal
 */
const coreAndroid = join(sourcesPath, 'android');

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
 * Given an File in Diez, returns a resource path for Android.
 *
 * This is achieved by:
 *  - lowercasing
 *  - replacing any non-alphanumeric characters with underscores
 *  - specifically excluding the final dot in the filename to preserve the file extension
 *
 * For example: `'some.directory.name/image@2x.png'` will become `'some_directory_name_image_2x.png'`,
 * and can be used in Android with name `some_directory_name_image_2x`.
 * @internal
 */
const getAndroidResourcePath = (file: File) =>
  encodeURI(file.src).toLowerCase().replace(/([^a-z0-9_\.]|\.(?=[^.]*\.))/g, '_');

/**
 * Migrates a [[File]] prefab's assetbinding to Android resources.
 * @ignore
 */
export const portAssetBindingToResource = (file: File, output: AndroidOutput, type: string, resourceFile?: File) => {
  if (!output.resources.has(type)) {
    output.resources.set(type, new Map());
  }

  const oldBinding = output.assetBindings.get(file.src);
  if (!oldBinding) {
    // This should never happen.
    throw new Error(`Unable to retrieve file binding from ${file.src}.`);
  }

  output.resources.get(type)!.set(getAndroidResourcePath(resourceFile || file), oldBinding);
  output.assetBindings.delete(file.src);
};

/**
 * A compiler for Android targets.
 * @noinheritdoc
 * @ignore
 */
export class AndroidCompiler extends TargetCompiler<AndroidOutput, AndroidBinding> {
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
    allProperties: (TargetComponentProperty | undefined)[]): TargetComponentProperty | undefined {
    const properties = allProperties.filter((property) => property !== undefined) as TargetComponentProperty[];
    const reference = properties[0];
    if (!reference) {
      return;
    }

    return {
      type: `Array<${reference.type}>`,
      initializer: `arrayOf<${reference.type}>(${properties.map((property) => property.initializer).join(', ')})`,
      isPrimitive: reference.isPrimitive,
      depth: reference.depth + 1,
    };
  }

  /**
   * @abstract
   */
  protected getInitializer (spec: TargetComponentSpec): string {
    const propertyInitializers: string[] = [];
    for (const name in spec.properties) {
      propertyInitializers.push(spec.properties[name].initializer);
    }

    return `${spec.componentName}(${propertyInitializers.join(', ')})`;
  }

  /**
   * @abstract
   */
  protected getPrimitive (type: PropertyType, instance: any): TargetComponentProperty | undefined {
    switch (type) {
      case PrimitiveType.String:
        return {
          type: 'String',
          initializer: `"${instance}"`,
          isPrimitive: true,
          depth: 0,
        };
      case PrimitiveType.Number:
      case PrimitiveType.Float:
        return {
          type: 'Float',
          initializer: `${instance.toString()}F`,
          isPrimitive: true,
          depth: 0,
        };
      case PrimitiveType.Int:
        return {
          type: 'Int',
          initializer: instance.toString(),
          isPrimitive: true,
          depth: 0,
        };
      case PrimitiveType.Boolean:
        return {
          type: 'Boolean',
          initializer: instance.toString(),
          isPrimitive: true,
          depth: 0,
        };
      default:
        Log.warning(`Unknown non-component primitive value: ${instance.toString()} with type ${type}`);
        return;
    }
  }

  /**
   * @abstract
   */
  protected createOutput (sdkRoot: string, projectName: string) {
    return {
      sdkRoot,
      projectName,
      packageName: `org.diez.${camelCase(projectName)}`,
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
    const component = Array.from(this.program.localComponentNames)[0];
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
    if (this.program.hot) {
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

  protected bindingContainsExtension (binding: AndroidBinding | undefined, filename: string) {
    if (!binding) {
      return false;
    }

    const match = binding.sources.find((source) => basename(source) === filename);
    return match !== undefined;
  }

  /**
   * @abstract
   */
  async writeSdk () {
    const packageComponents = this.output.packageName.split('.');
    const sourcesRoot = join(this.output.sdkRoot, 'src', 'main', 'java', ...packageComponents);
    ensureDirSync(sourcesRoot);

    const coreBasenames = [
      'Diez.kt',
      'Environment.kt',
      'Extensions.kt',
    ];
    for (const filename of coreBasenames) {
      const template = readFileSync(join(coreAndroid, 'core', filename)).toString();
      const path = join(sourcesRoot, filename);
      writeFileSync(path, compile(template)({
        packageName: this.output.packageName,
      }));
    }

    const dataClassStartTemplate = readFileSync(join(coreAndroid, 'android.data-class.start.handlebars')).toString();
    registerPartial('androidDataClassStart', dataClassStartTemplate);

    const componentTemplate = readFileSync(join(coreAndroid, 'android.component.handlebars')).toString();

    for (const [type, {spec, binding}] of this.output.processedComponents) {
      // For each singleton, replace it with its simple constructor.
      for (const property of Object.values(spec.properties)) {
        if (this.program.singletonComponentNames.has(property.type)) {
          property.initializer = `${property.type}()`;
        }
      }

      const dataClassStartTokens = {
        ...spec,
        singleton: spec.public || this.program.singletonComponentNames.has(type),
        hasProperties: Object.keys(spec.properties).length > 0,
      };

      const componentTokens = {
        ...dataClassStartTokens,
        packageName: this.output.packageName,
      };

      const componentBasename = `${spec.componentName}.kt`;
      let hasComponentOverride = false;
      if (binding) {
        for (const source of binding.sources) {
          const template = readFileSync(source).toString();
          const sourceBasename = basename(source);
          const bindingPath = join(sourcesRoot, sourceBasename);
          writeFileSync(bindingPath, compile(template)(componentTokens));

          if (sourceBasename === componentBasename) {
            hasComponentOverride = true;
          }
        }

        if (binding.dependencies) {
          for (const dependency of binding.dependencies) {
            mergeDependency(this.output.dependencies, dependency);
          }
        }
      }

      // We only need to write a component here if a binding hasn't already been written with the data class
      // implementation. This is determined by checking the name of the file to see if it matches our component name.
      if (!hasComponentOverride) {
        const sourceBasename = basename(`${spec.componentName}.kt`);
        const bindingPath = join(sourcesRoot, sourceBasename);
        writeFileSync(bindingPath, compile(componentTemplate)(componentTokens));
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
