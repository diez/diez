/* tslint:disable:max-line-length ban-types */
import {exitTrap, Log} from '@diez/cli-core';
import {serialize} from '@diez/engine';
import {watch} from 'chokidar';
import {copySync, ensureDirSync, existsSync, outputFileSync, removeSync, writeFileSync} from 'fs-extra';
import {dirname, join} from 'path';
import {CompilerEvent, DiezComponent, DiezType, MaybeNestedArray, Parser, Property, TargetBinding, TargetDiezComponent, TargetOutput, TargetProperty} from './api';
import {serveHot} from './server';
import {ExistingHotUrlMutexError, getBinding, getHotPort, inferProjectName, isConstructible, loadComponentModule, purgeRequireCache, showStackTracesFromRuntimeError} from './utils';

/**
 * An abstract class wrapping the basic functions of a compiler.
 *
 * Although this class may provide useful time-saving abstractions, it is by no means a requirement to use
 * [[Compiler]] when building a "compiler for a target"—the only thing a [[CompilerProvider]] is guaranteed
 * to receive is an instance of a [[Parser]].
 *
 * @typeparam OutputType - The type of target output we build during the compilation process.
 * @typeparam BindingType - The shape of asset bindings in our target.
 */
export abstract class Compiler<
  OutputType extends TargetOutput,
  BindingType extends TargetBinding<any, OutputType>,
> {
  /**
   * The output we should collect to write an SDK.
   */
  output: OutputType;

  /**
   * Creates fresh output.
   */
  protected abstract createOutput (sdkRoot: string, projectName: string): OutputType;

  /**
   * Validates compiler options.
   */
  protected abstract validateOptions (): Promise<void>;

  /**
   * Collects and consolidates component properties of a list type in the semantics of the target type.
   *
   * For example, this method might turn `["foo", "bar"]` into `new ArrayList<String>(){{ add("foo"); add("bar"); }}`
   * for a Java target.
   */
  protected abstract collectComponentProperties (parent: Property, allProperties: (TargetProperty | undefined)[]): TargetProperty | undefined;

  /**
   * Gets the target-specific initializer for a given target component spec.
   *
   * This might look like `"foo"` for a primitive type, or `new ComponentType()` for a component.
   */
  protected abstract getInitializer (targetComponent: TargetDiezComponent): string;

  /**
   * Gets the target-specific primitive type name for the provided type.
   *
   * For example, this method might return `String` on a platform where "String" is the target's string type name.
   */
  protected abstract getPrimitiveName (type: DiezType): string | undefined;

  /**
   * Gets the target-specific primitive type initializer for the provided type.
   *
   * For example, this method might return `"foo"` for a string.
   */
  protected abstract getPrimitiveInitializer (type: DiezType, instance: any): string | undefined;

  /**
   * The root where we should place static assets.
   */
  abstract staticRoot: string;

  /**
   * The root where we should serve static content in hot mode.
   */
  protected get hotStaticRoot () {
    return join(this.parser.projectRoot, '.diez', `${this.parser.options.target}-assets`);
  }

  /**
   * The hostname for hot serving.
   */
  abstract hostname (): Promise<string>;

  /**
   * The name of the package we should provide.
   */
  abstract moduleName: string;

  /**
   * The component path for hot serving.
   */
  abstract hotComponent: string;

  /**
   * Prints usage instructions.
   */
  abstract printUsageInstructions (): void;

  /**
   * Clears all output state and starts fresh.
   */
  abstract clear (): void;

  /**
   * Writes the transpiled SDK to disk.
   */
  abstract async writeSdk (): Promise<void | void[]>;

  constructor (readonly parser: Parser) {
    const projectName = inferProjectName(parser.projectRoot);
    this.output = this.createOutput(
      join(parser.projectRoot, 'build', `diez-${projectName}-${parser.options.target}`),
      projectName,
    );

    if (!parser.hot) {
      removeSync(this.output.sdkRoot);
      ensureDirSync(this.output.sdkRoot);
    }
  }

  /**
   * Generates a fresh component spec for a given type.
   */
  private createTargetComponent (type: DiezType): TargetDiezComponent {
    return {
      ...this.parser.getComponentForTypeOrThrow(type),
      // We will need to augment properties before they can be added.
      properties: [],
    };
  }

  /**
   * Gets the target-specific spec for given primitive component type.
   */
  protected getPrimitive (property: Property, instance: any): TargetProperty | undefined {
    const name = this.getPrimitiveName(property.type);
    const initializer = this.getPrimitiveInitializer(property.type, instance);
    if (!name || !initializer) {
      Log.warning(`Unknown non-component primitive value: ${instance.toString()} with type ${property.type}`);
      return;
    }

    return {
      ...property,
      initializer,
      type: name,
    };
  }

  /**
   * Recursively processes a component property.
   */
  protected async processComponentProperty (
    property: Property,
    instance: MaybeNestedArray<any>,
    serializedInstance: MaybeNestedArray<any>,
    component: DiezComponent,
  ): Promise<TargetProperty | undefined> {
    if (Array.isArray(instance)) {
      if (!property.depth) {
        // This should never happen.
        component.warnings.ambiguousTypes.add(property.name);
        return;
      }

      return this.collectComponentProperties(property, await Promise.all(instance.map(async (child, index) =>
        this.processComponentProperty(property, child, serializedInstance[index], component),
      )));
    }

    if (property.isComponent) {
      const targetComponent = await this.processComponentInstance(instance, property.type);
      if (!targetComponent) {
        component.warnings.ambiguousTypes.add(property.name);
        return;
      }

      const propertyComponent = this.parser.components.get(property.type)!;
      const propertyBinding = await getBinding<BindingType>(
        this.parser.options.target, propertyComponent.sourceModule, property.type);
      if (propertyBinding) {
        if (propertyBinding.assetsBinder) {
          await propertyBinding.assetsBinder(instance, this.parser, this.output, targetComponent, property);
        }
      }

      return Object.assign({originalType: property.type}, property, {initializer: this.getInitializer(targetComponent)});
    }

    return this.getPrimitive(property, serializedInstance);
  }

  /**
   * Recursively processes a component instance and all its properties.
   */
  protected async processComponentInstance (instance: any, name: DiezType) {
    const component = this.parser.components.get(name);
    if (!component) {
      Log.warning(`Unable to find component definition for ${name}!`);
      return;
    }

    const targetComponent = this.createTargetComponent(name);
    const serializedData = serialize(instance);

    for (const property of component.properties) {
      // TODO: move this check upstream of the compiler, into the compiler metadata stream where it belongs.
      if (
        instance &&
        instance.options &&
        instance.options[property.name] &&
        Array.isArray(instance.options[property.name].targets) &&
        !instance.options[property.name].targets.includes(this.parser.options.target)
      ) {
        // We are looking at a property that is either not a state or explicitly excluded by the host.
        continue;
      }

      const propertySpec = await this.processComponentProperty(
        property,
        instance[property.name],
        serializedData[property.name],
        component,
      );

      if (propertySpec) {
        targetComponent.properties.push(propertySpec);
      }
    }

    if (!this.output.processedComponents.has(name)) {
      targetComponent.binding = await getBinding<BindingType>(this.parser.options.target, component.sourceModule || '.', name);
      this.output.processedComponents.set(name, targetComponent);
    }

    return targetComponent;
  }

  /**
   * Runs the compilation routine, processing all root components and populating output based on the results.
   *
   * The compilation routine is not guaranteed to be idempotent, which is the reason `buildHot` resets output before running.
   */
  async run () {
    // Important: reset the require cache before each run.
    purgeRequireCache(require.resolve(this.parser.emitRoot));
    let componentModule;

    try {
      componentModule = await loadComponentModule(this.parser.emitRoot);
    } catch (error) {
      await showStackTracesFromRuntimeError(error);
      process.exit(1);
    }

    for (const componentName of this.parser.rootComponentNames) {
      // Fall back to the camel case variant of the component name. The parser capitalizes component names automatically.
      const {symbolName} = this.parser.getMetadataForTypeOrThrow(componentName);
      const maybeConstructor = componentModule[symbolName];
      if (!maybeConstructor) {
        Log.warning(`Unable to resolve component instance from ${this.parser.projectRoot}: ${componentName}.`);
        continue;
      }

      const componentInstance = isConstructible(maybeConstructor) ? new maybeConstructor() : maybeConstructor;
      await this.processComponentInstance(componentInstance, componentName);
    }
  }

  /**
   * A hot URL mutex clients can look for.
   */
  private get hotUrlMutex () {
    return join(this.parser.projectRoot, '.diez', `${this.parser.options.target}-hot-url`);
  }

  /**
   * Cleans up the hot URL mutex for the next session.
   */
  private cleanupHotUrlMutex = () => {
    removeSync(this.hotUrlMutex);
    process.exit(0);
  };

  /**
   * Writes the hot URL mutex once.
   */
  private writeHotUrlMutex (hostname: string, devPort: number) {
    if (existsSync(this.hotUrlMutex)) {
      throw new ExistingHotUrlMutexError(
        `Found existing hot URL at ${this.hotUrlMutex}. If this is an error, please manually remove the file.`,
        this.hotUrlMutex,
      );
    }
    exitTrap(() => this.cleanupHotUrlMutex());
    this.output.hotUrl = `http://${hostname}:${devPort}`;
    writeFileSync(this.hotUrlMutex, this.output.hotUrl);
    watch(this.hotUrlMutex).on('unlink', this.cleanupHotUrlMutex);
  }

  /**
   * Starts the compiler. In dev mode, this will start a server with hot module reloading and continuously rebuild the SDK;
   * in production mode, this will write an SDK once and exit.
   */
  async start () {
    await this.validateOptions();
    if (this.parser.hot) {
      const [devPort, hostname] = await Promise.all([getHotPort(), this.hostname()]);
      this.writeHotUrlMutex(hostname, devPort);

      if (!await this.buildHot()) {
        // TODO: make this retry without throwing.
        throw new Error('Unable to perform initial build.');
      }

      serveHot(
        this.parser,
        this.hotComponent,
        devPort,
        this.hotStaticRoot,
      );
      // Important: only handle one Compiled event at a time to prevent races.
      this.parser.on(CompilerEvent.Compiled, async () => {
        await this.buildHot();
      });
    } else {
      await this.run();
      await this.writeSdk();
      this.printUsageInstructions();
    }
  }

  /**
   * @internal
   */
  private async buildHot () {
    Object.assign(this.output, this.createOutput(this.output.sdkRoot, this.output.projectName));
    try {
      await this.run();
    } catch (error) {
      Log.warning('Unable to compile.');
      Log.warning(error);
      return false;
    }

    await this.writeAssets();
    copySync(this.parser.emitRoot, this.parser.hotRoot);
    return true;
  }

  /**
   * Writes out bound assets from the compiler's asset bindings.
   */
  writeAssets () {
    const staticRoot = this.parser.hot ? this.hotStaticRoot : this.staticRoot;
    removeSync(staticRoot);
    for (const [path, binding] of this.output.assetBindings) {
      const outputPath = join(staticRoot, path);
      ensureDirSync(dirname(outputPath));
      if (binding.copy) {
        copySync(binding.contents as string, outputPath);
        continue;
      }

      outputFileSync(outputPath, binding.contents);
    }
  }
}
