import {code, info, inlineCodeSnippet, warning} from '@diez/cli-core';
import {
  CompilerTargetHandler,
  PrimitiveType,
  PropertyType,
  TargetCompiler,
  TargetComponentProperty,
  TargetComponentSpec,
} from '@diez/compiler';
import {File} from '@diez/prefabs';
import {getTempFileName, outputTemplatePackage} from '@diez/storage';
import camelCase from 'camel-case';
import {
  copySync,
  ensureDirSync,
  openSync,
  outputFileSync,
  readFileSync,
  removeSync,
  writeFileSync,
  writeSync,
} from 'fs-extra';
import {compile} from 'handlebars';
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
      updatable: reference.updatable,
    };
  }

  /**
   * @abstract
   */
  protected getInitializer (spec: TargetComponentSpec<TargetComponentProperty>): string {
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
          updatable: false,
        };
      case PrimitiveType.Number:
      case PrimitiveType.Float:
        return {
          type: 'Float',
          initializer: `${instance.toString()}F`,
          updatable: false,
        };
      case PrimitiveType.Int:
        return {
          type: 'Int',
          initializer: instance.toString(),
          updatable: false,
        };
      case PrimitiveType.Boolean:
        return {
          type: 'Boolean',
          initializer: instance.toString(),
          updatable: false,
        };
      default:
        warning(`Unknown non-component primitive value: ${instance.toString()} with type ${type}`);
        return;
    }
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
  protected createOutput (sdkRoot: string, projectName: string) {
    return {
      sdkRoot,
      projectName,
      packageName: `org.diez.${camelCase(projectName)}`,
      files: new Map([
        ['Diez.kt', {dataClass: join(coreAndroid, 'core', 'Diez.kt')}],
        ['Environment.kt', {dataClass: join(coreAndroid, 'core', 'Environment.kt')}],
      ]),
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
    const diez = inlineCodeSnippet('Diez');
    const component = this.program.localComponentNames[0];
    info(`Diez module compiled to ${this.output.sdkRoot}.\n`);

    info(`You can depend on ${diez} in ${inlineCodeSnippet('build.gradle')}:`);
    code(`implementation project(':${this.moduleName}')
`);

    info(`You can use ${diez} to bootstrap any of the components defined in your project.\n`);

    code(`import ${this.output.packageName}.*

class MainActivity … {
  override fun onCreate(…) {
    // …
    Diez(
      ${component}(),
      viewGroup
    ).attach(fun(component) {
      runOnUiThread {
          // …
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
    this.output.sources.clear();
    this.output.files.clear();
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

  /**
   * @abstract
   */
  async writeSdk () {
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
      if (binding) {
        this.mergeBindingToOutput(binding);
      }

      // For each singleton, replace it with its simple constructor.
      for (const property of Object.values(spec.properties)) {
        if (singletons.has(property.type)) {
          property.initializer = `${property.type}()`;
        }
      }

      const filename = getTempFileName();
      writeFileSync(
        filename,
        compile(componentTemplate)({
          ...spec,
          singleton: spec.public || singletons.has(type),
          hasProperties: Object.keys(spec.properties).length > 0,
        }),
      );

      this.output.files.set(`${spec.componentName}.kt`, {dataClass: filename});
    }

    const packageComponents = this.output.packageName.split('.');
    const sourcesRoot = join(this.output.sdkRoot, 'src', 'main', 'java', ...packageComponents);
    const prefixBuffer = Buffer.from(`package ${this.output.packageName}\n\n`);
    ensureDirSync(sourcesRoot);

    for (const source of this.output.sources) {
      const filename = basename(source);
      if (this.output.files.has(filename)) {
        this.output.files.get(filename)!.extension = source;
      } else {
        this.output.files.set(filename, {dataClass: source});
      }
    }

    for (const [filename, {dataClass, extension}] of this.output.files) {
      const outputPath = join(sourcesRoot, filename);
      const handle = openSync(outputPath, 'w+');
      let cursor = 0;
      writeSync(handle, prefixBuffer, 0, prefixBuffer.length, cursor);
      cursor += prefixBuffer.length;
      if (extension) {
        const extensionBuffer = readFileSync(extension);
        writeSync(handle, extensionBuffer, 0, extensionBuffer.length, cursor);
        cursor += extensionBuffer.length;
        writeSync(handle, Buffer.from('\n'), 0, 1, cursor);
        cursor += 1;
      }

      const sourceBuffer = readFileSync(dataClass);
      writeSync(handle, sourceBuffer, 0, sourceBuffer.length, cursor);
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
  await new AndroidCompiler(program).start();
};
