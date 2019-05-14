import {code, info, inlineCodeSnippet, warning} from '@diez/cli-core';
import {
  CompilerTargetHandler,
  PrimitiveType,
  PropertyType,
  TargetCompiler,
  TargetComponentProperty,
  TargetComponentSpec,
} from '@diez/compiler';
import {getTempFileName, outputTemplatePackage} from '@diez/storage';
import {copySync, ensureDirSync, outputFileSync, readFileSync, removeSync, writeFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {v4} from 'internal-ip';
import {basename, dirname, join} from 'path';
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
      updateable: reference.updateable,
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
    if (this.program.options.devMode) {
      return join(this.output.sdkRoot, 'src', 'main', 'assets');
    }

    return join(this.output.sdkRoot, 'src', 'main', 'res', 'raw');
  }

  /**
   * @abstract
   */
  printUsageInstructions () {
    const diez = inlineCodeSnippet('Diez');
    const component = this.program.localComponentNames[0];
    info(`Diez SDK installed locally at ${join(this.program.projectRoot, 'diez')}.\n`);

    info(`You can register the local module in ${inlineCodeSnippet('settings.gradle')} like so:`);
    code(`include ':app', ':diez'
project(':diez').projectDir = new File(\"\${new File(\".\").absolutePath}/diez\")
`);

    info(`Then you can depend on ${diez} in ${inlineCodeSnippet('build.gradle')}:`);
    code(`implementation project(':diez')
`);

    info(`You can use ${diez} to bootstrap any of the components defined in your project.\n`);

    code(`import org.diez.*

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
   * Overrides asset writeout so we can write raw resources.
   */
  writeAssets () {
    if (this.program.options.devMode) {
      super.writeAssets();
      return;
    }

    removeSync(this.staticRoot);
    for (const [path, binding] of this.output.assetBindings) {
      const outputPath = join(this.staticRoot, encodeURI(path).toLowerCase().replace(/[^a-z0-9_]/g, '_'));
      ensureDirSync(dirname(outputPath));
      if (binding.copy) {
        copySync(binding.contents as string, outputPath);
        continue;
      }

      outputFileSync(outputPath, binding.contents);
    }
  }

  /**
   * Rebinds assets, but skips the remainder of SDK regeneration. Prevents useless overwrites for an already built app.
   */
  private rebindAssets () {
    for (const {binding} of this.output.processedComponents.values()) {
      if (binding) {
        this.mergeBindingToOutput(binding);
      }
    }

    this.writeAssets();
  }

  /**
   * @abstract
   */
  async writeSdk (hostname?: string, devPort?: number) {
    if (this.hasBuiltOnce) {
      this.rebindAssets();
      return;
    }

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
          hasProperties: Object.keys(spec.properties).length > 0,
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
      devMode: !!this.program.options.devMode,
      dependencies: Array.from(this.output.dependencies),
      sources: Array.from(this.output.sources).map((source) => readFileSync(source).toString()),
    };

    this.writeAssets();
    outputTemplatePackage(join(coreAndroid, 'sdk'), this.output.sdkRoot, tokens);
  }
}

/**
 * Handles Android target compilation.
 * @ignore
 */
export const androidHandler: CompilerTargetHandler = async (program) => {
  await new AndroidCompiler(program, join(program.options.outputPath, 'diez')).start();
};
