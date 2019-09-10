/* tslint:disable:max-line-length ban-types */
import {exitTrap, Log} from '@diez/cli-core';
import {serialize} from '@diez/engine';
import {EventEmitter} from 'events';
import {copySync, ensureDirSync, existsSync, outputFileSync, removeSync, writeFileSync} from 'fs-extra';
import {dirname, join, relative} from 'path';
import {ClassDeclaration, EnumDeclaration, JSDocableNode, Project, PropertyDeclaration, Scope, SourceFile, Symbol, Type, TypeChecker} from 'ts-morph';
import {createAbstractBuilder, createWatchCompilerHost, createWatchProgram, Diagnostic, FormatDiagnosticsHost, formatDiagnosticsWithColorAndContext, isClassDeclaration, Program as TypescriptProgram, SymbolFlags, sys} from 'typescript';
import {v4} from 'uuid';
import {CompilerEvent, CompilerOptions, CompilerProgram, MaybeNestedArray, NamedComponentMap, PrimitiveType, PrimitiveTypes, PropertyDescription, PropertyType, TargetBinding, TargetComponent, TargetComponentProperty, TargetComponentSpec, TargetOutput, TargetProperty} from './api';
import {serveHot} from './server';
import {getBinding, getHotPort, getProject, inferProjectName, isConstructible, loadComponentModule, purgeRequireCache} from './utils';

/**
 * A class implementing the requirements of Diez compilation.
 * @noinheritdoc
 */
export class Program extends EventEmitter implements CompilerProgram {
  private readonly diagnosticsHost: FormatDiagnosticsHost = {
    getCurrentDirectory: sys.getCurrentDirectory,
    getNewLine: () => sys.newLine,
    getCanonicalFileName: (name) => name,
  };

  /**
   * The wrapped TypeScript project.
   */
  private readonly project: Project;

  /**
   * A typechecker capable of resolving any known types.
   */
  private readonly checker: TypeChecker;

  /**
   * The component declaration, which we can use to determine component-ness using the typechecker.
   */
  private readonly prefabDeclaration: ClassDeclaration;

  /**
   * The active TypeScript program.
   */
  private program: TypescriptProgram;

  /**
   * @ignore
   */
  private readonly types: PrimitiveTypes;

  /**
   * @ignore
   */
  readonly localComponentNames = new Set<PropertyType>();

  /**
   * @ignore
   */
  readonly singletonComponentNames = new Set<PropertyType>();

  /**
   * @ignore
   */
  readonly targetComponents: NamedComponentMap;

  /**
   * @ignore
   */
  readonly emitRoot: string;

  /**
   * @ignore
   */
  readonly hotRoot: string = '';

  /**
   * @ignore
   */
  hotBuildStartTime = 0;

  private validateProject () {
    const mainFilePath = join(this.projectRoot, 'src', 'index.ts');
    if (!existsSync(mainFilePath)) {
      throw new Error(`Unable to proceed: no main file found at ${mainFilePath}`);
    }

    const rootDir = this.project.getCompilerOptions().rootDir;
    if (!rootDir || relative(this.projectRoot, rootDir) !== 'src') {
      throw new Error(
        'Unable to proceed: TypeScript configuration at does not compile from src/. Please fix the TypeScript configuration and try again.');
    }
  }

  /**
   * Returns the primitive type of an enum type. In the case of heterogeneous enums, returns "unknown" type.
   */
  private getEnumType (declaration: EnumDeclaration): PrimitiveType {
    const memberValues = declaration.getMembers().map((member) => this.checker.getConstantValue(member));

    if (memberValues.every((value) => typeof value === 'string')) {
      return PrimitiveType.String;
    }

    if (memberValues.every((value) => typeof value === 'number')) {
      return PrimitiveType.Float;
    }

    // We are looking at a heterogeneous enum, which does not suit a type system.
    return PrimitiveType.Unknown;
  }

  /**
   * Returns a primitive type for a given type.
   */
  private getPrimitiveType (type: Type): PrimitiveType {
    if (type.isString()) {
      return PrimitiveType.String;
    }

    if (type.isBoolean()) {
      return PrimitiveType.Boolean;
    }

    if (type.isNumber() || type === this.types[PrimitiveType.Float]) {
      return PrimitiveType.Float;
    }

    if (type === this.types[PrimitiveType.Int]) {
      return PrimitiveType.Int;
    }

    if (type.isEnum()) {
      return this.getEnumType(type.getSymbolOrThrow().getValueDeclarationOrThrow() as EnumDeclaration);
    }

    return PrimitiveType.Unknown;
  }

  private getDescriptionForValue (describable: JSDocableNode): PropertyDescription {
    const lines: string[] = [];
    for (const jsDoc of describable.getJsDocs()) {
      const comment = jsDoc.getComment();
      if (comment !== undefined) {
        lines.push(comment);
      }
    }

    return {body: lines.join('\n')};
  }

  /**
   * Processes a component type and attaches it to a preconstructed target component map.
   *
   * @returns `true` if we were able to process the type as a component.
   */
  private processType (type: Type, sourceMap: Map<string, string>) {
    const typeSymbol = type.getSymbol();
    if (!type.isObject() || !typeSymbol) {
      return false;
    }

    const typeValue = typeSymbol.getValueDeclaration() as ClassDeclaration | undefined;

    if (typeValue === undefined || !isClassDeclaration(typeValue.compilerNode)) {
      // FIXME: we should allow non-class declarations as long as they use explicit types.
      return false;
    }

    const children: Symbol[] = [];
    if (typeValue.getBaseClass() === this.prefabDeclaration) {
      for (const symbol of type.getProperties()) {
        if (symbol.getFlags() !== SymbolFlags.Property) {
          continue;
        }
        children.push(symbol);
      }
    } else {
      for (const property of typeValue.getProperties()) {
        if (property.getScope() !== Scope.Public) {
          continue;
        }

        children.push(typeSymbol.getMemberOrThrow(property.getName()));
      }
    }

    const componentName = typeValue.getName();
    if (!componentName) {
      // FIXME: we should be able to handle this by automatically generating anonymous componenet names.
      Log.warning('Encountered an unnamed component class. Components without names are skipped.');
      return false;
    }

    if (
      this.targetComponents.has(componentName)
    ) {
      if (this.targetComponents.get(componentName)!.type !== type) {
        // FIXME: we should be able to handle this by automatically renaming components (e.g. `Color`, `Color0`...).
        Log.warning(`Encountered a duplicate component name: ${componentName}. Please ensure no component names are duplicated.`);
        return false;
      }

      return true;
    }

    const newTarget: TargetComponent = {
      type,
      properties: [],
      warnings: {
        ambiguousTypes: new Set(),
      },
      source: sourceMap.get(typeValue.getSourceFile().getFilePath()) || '.',
      description: this.getDescriptionForValue(typeValue),
    };

    // Note if the object in question is a singleton, i.e. receives no constructor arguments.
    let constructorClass: ClassDeclaration | undefined = typeValue;
    while (constructorClass && !constructorClass.getConstructors().length) {
      constructorClass = constructorClass.getBaseClass();
    }
    if (!constructorClass || constructorClass.getConstructors().every(
      (constructor) => !constructor.getParameters().length)) {
      this.singletonComponentNames.add(componentName);
    }

    for (const typeMember of children) {
      const valueDeclaration = typeMember.getValueDeclaration() as PropertyDeclaration;
      if (!valueDeclaration) {
        // This should never happen?
        continue;
      }
      const propertyName = valueDeclaration.getName();
      const description = this.getDescriptionForValue(valueDeclaration);
      let propertyType = this.checker.getTypeAtLocation(valueDeclaration);
      // Process array type depth.
      // TODO: support tuples and other iterables.
      let depth = 0;
      while (propertyType && propertyType.isArray()) {
        depth++;
        propertyType = propertyType.getArrayElementType()!;
      }

      if (!propertyType || propertyType.isUnknown() || propertyType.isAny()) {
        newTarget.warnings.ambiguousTypes.add(propertyName);
        continue;
      }

      if (
        propertyType.isString() ||
        propertyType.isBoolean() ||
        propertyType.isNumber() ||
        propertyType === this.types[PrimitiveType.Int] ||
        propertyType === this.types[PrimitiveType.Float] ||
        propertyType.isEnum()
      ) {
        const primitiveType = this.getPrimitiveType(propertyType);
        if (primitiveType === PrimitiveType.Unknown) {
          newTarget.warnings.ambiguousTypes.add(propertyName);
        } else {
          newTarget.properties.push({depth, description, name: propertyName, isComponent: false, type: primitiveType});
        }
        continue;
      }

      // TODO: deal with propertyType.isUnion().
      if (propertyType.isUnion()) {
        // The type system cannot tolerate non-primitive union types not handled above.
        newTarget.warnings.ambiguousTypes.add(propertyName);
        continue;
      }

      if (!this.processType(propertyType, sourceMap)) {
        continue;
      }

      const candidateSymbol = propertyType.getSymbolOrThrow();

      newTarget.properties.push({
        depth,
        description,
        name: propertyName,
        isComponent: true,
        type: candidateSymbol.getName(),
        parentType: componentName,
      });
    }

    this.targetComponents.set(componentName, newTarget);
    return true;
  }

  private locateSources (sourceFile: SourceFile, sourceMap: Map<string, string>) {
    if (!sourceFile.compilerNode.resolvedModules) {
      return;
    }

    for (const resolvedModule of sourceFile.compilerNode.resolvedModules.values()) {
      if (!resolvedModule) {
        continue;
      }

      sourceMap.set(
        resolvedModule.resolvedFileName,
        (resolvedModule.isExternalLibraryImport && resolvedModule.packageId) ? resolvedModule.packageId.name : '.',
      );

      this.locateSources(
        this.project.getSourceFileOrThrow(resolvedModule.resolvedFileName),
        sourceMap,
      );
    }
  }

  /**
   * Runs the compiler and emits to listeners.
   */
  async run (throwOnErrors = true) {
    this.targetComponents.clear();
    this.localComponentNames.clear();
    if (!await this.compile()) {
      if (throwOnErrors) {
        throw new Error('Unable to compile project!');
      }

      this.emit(CompilerEvent.Error);
      return;
    }

    const sourceFile = this.project.getSourceFileOrThrow(join(this.projectRoot, 'src', 'index.ts'));
    const sourceMap = new Map<string, string>();
    this.locateSources(sourceFile, sourceMap);
    for (const exportedDeclarations of sourceFile.getExportedDeclarations().values()) {
      for (const exportDeclaration of exportedDeclarations) {
        const type = this.checker.getTypeAtLocation(exportDeclaration);
        if (this.processType(type, sourceMap)) {
          this.localComponentNames.add(type.getSymbolOrThrow().getName());
        }
      }
    }

    this.emit(CompilerEvent.Compiled);
  }

  /**
   * Actually compiles the project, emitting JS source files for runtime compilation.
   */
  private async compile () {
    Log.info('Compiling project...');
    const emitResult = await this.program.emit();
    this.printDiagnostics(emitResult.diagnostics);
    return emitResult.diagnostics.length === 0;
  }

  /**
   * Pretty prints TypeScript diagnostics.
   */
  private printDiagnostics (diagnostics: Diagnostic | ReadonlyArray<Diagnostic>) {
    if (Array.isArray(diagnostics)) {
      if (!diagnostics.length) {
        return;
      }

      sys.write(formatDiagnosticsWithColorAndContext(diagnostics, this.diagnosticsHost));
      return;
    }

    this.printDiagnostics([diagnostics] as ReadonlyArray<Diagnostic>);
  }

  /**
   * Starts a TypeScript server in watch mode, similar to `tsc --watch` but with more control over when sources are emitted.
   */
  watch () {
    const host = createWatchCompilerHost(
      this.program.getRootFileNames() as string[],
      Object.assign(
        this.program.getCompilerOptions(),
        {
          // Enabling this option greatly speeds up builds.
          skipLibCheck: true,
          // See https://github.com/Microsoft/TypeScript/issues/7363.
          suppressOutputPathCheck: true,
          // Instead of emitting invalid state, we should bail on compilation.
          noEmitOnError: true,
          // Write out to the expected directory.
          outDir: this.emitRoot,
        },
      ),
      sys,
      createAbstractBuilder,
      (diagnostic) => this.printDiagnostics(diagnostic),
      (diagnostic) => this.printDiagnostics(diagnostic),
    );

    // Skip watch status change notifications.
    host.onWatchStatusChange = () => {
      this.hotBuildStartTime = Date.now();
    };

    host.afterProgramCreate = (watchProgram) => {
      this.program = watchProgram.getProgram();
      this.run(false);
    };

    // Expose the close() function so that the FileWatcher can be closed in unit tests.
    // Unit tests would hang on a leaked handle unless we shut down the file watcher.
    this.close = createWatchProgram(host).close;
  }

  /**
   * In dev mode, this method is replaced with a command that stops watching files and shuts the server down.
   * @ignore
   */
  close () {}

  constructor (
    readonly projectRoot: string,
    readonly options: CompilerOptions,
    readonly hot = false,
  ) {
    super();

    Log.info(`Validating project structure at ${projectRoot}...`);

    try {
      this.project = getProject(projectRoot);
    } catch (e) {
      throw new Error('Unable to load TypeScript project. Please try again.');
    }

    this.validateProject();

    this.program = this.project.getProgram().compilerObject;
    this.checker = this.project.getTypeChecker();

    if (hot) {
      this.emitRoot = join(projectRoot, '.diez', v4());
      this.hotRoot = join(projectRoot, '.diez', v4());
    } else {
      const compilerOptions = this.project.getCompilerOptions();
      this.emitRoot = compilerOptions.outDir || compilerOptions.rootDir!;
    }

    // Create a stub type file for typing the Component class and number primitives.
    const stubTypeFile = this.project.createSourceFile(
      join('src', '__stub.ts'),
      'import {Prefab, Integer, Float} from \'@diez/engine\';',
      {overwrite: true},
    );

    const [prefabImport, intImport, floatImport] = stubTypeFile.getImportDeclarationOrThrow('@diez/engine').getNamedImports();
    this.targetComponents = new Map();
    this.prefabDeclaration = this.checker.getTypeAtLocation(prefabImport).getSymbolOrThrow().getValueDeclarationOrThrow() as ClassDeclaration;
    this.types = {
      [PrimitiveType.Int]: intImport.getSymbolOrThrow().getDeclaredType(),
      [PrimitiveType.Float]: floatImport.getSymbolOrThrow().getDeclaredType(),
    };
  }
}

/**
 * An abstract class wrapping the basic functions of a target compiler.
 *
 * Although this class may provide useful time-saving abstractions, it is by no means a requirement to use
 * [[TargetCompiler]] when building a "compiler for a target"—the only thing a [[CompilerTargetProvider]] is guaranteed
 * to receive is an instance of a [[CompilerProgram]].
 *
 * @typeparam OutputType - The type of target output we build during the compilation process.
 * @typeparam BindingType - The shape of asset bindings in our target.
 */
export abstract class TargetCompiler<
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
  protected abstract collectComponentProperties (allProperties: (TargetComponentProperty | undefined)[]): TargetComponentProperty | undefined;

  /**
   * Gets the target-specific initializer for a given target component spec.
   *
   * This might look like `"foo"` for a primitive type, or `new ComponentType()` for a component.
   */
  protected abstract getInitializer (spec: TargetComponentSpec): string;

  /**
   * Gets the target-specific spec for given primitive component type.
   */
  protected abstract getPrimitive (type: PropertyType, instance: any): TargetComponentProperty | undefined;

  /**
   * The root where we should place static assets.
   */
  abstract staticRoot: string;

  /**
   * The root where we should serve static content in hot mode.
   */
  protected get hotStaticRoot () {
    return join(this.program.projectRoot, '.diez', `${this.program.options.target}-assets`);
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

  constructor (readonly program: CompilerProgram) {
    const projectName = inferProjectName(program.projectRoot);
    this.output = this.createOutput(
      join(program.projectRoot, 'build', `diez-${projectName}-${program.options.target}`),
      projectName,
    );

    if (!program.hot) {
      removeSync(this.output.sdkRoot);
      ensureDirSync(this.output.sdkRoot);
    }
  }

  /**
   * Generates a fresh component spec for a given type.
   */
  private createSpec (type: PropertyType): TargetComponentSpec {
    return {componentName: type, properties: {}, public: this.program.localComponentNames.has(type)};
  }

  /**
   * Recursively processes a component property.
   */
  protected async processComponentProperty (
    property: TargetProperty,
    instance: MaybeNestedArray<any>,
    serializedInstance: MaybeNestedArray<any>,
    targetComponent: TargetComponent,
  ): Promise<TargetComponentProperty | undefined> {
    if (Array.isArray(instance)) {
      if (!property.depth) {
        // This should never happen.
        targetComponent.warnings.ambiguousTypes.add(property.name);
        return;
      }

      return this.collectComponentProperties(await Promise.all(instance.map(async (child, index) =>
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
      const propertyBinding = await getBinding<BindingType>(
        this.program.options.target, propertyComponent.source, property.type);
      if (propertyBinding) {
        if (propertyBinding.assetsBinder) {
          await propertyBinding.assetsBinder(instance, this.program, this.output, componentSpec, property);
        }
      }

      return {
        type: componentSpec.componentName,
        initializer: this.getInitializer(componentSpec),
        isPrimitive: false,
        depth: 0,
      };
    }

    return this.getPrimitive(property.type, serializedInstance);
  }

  /**
   * Recursively processes a component instance and all its properties.
   */
  protected async processComponentInstance (instance: any, name: PropertyType) {
    const targetComponent = this.program.targetComponents.get(name);
    if (!targetComponent) {
      Log.warning(`Unable to find component definition for ${name}!`);
      return;
    }

    const spec = this.createSpec(name);
    const serializedData = serialize(instance);

    for (const property of targetComponent.properties) {
      // TODO: move this check upstream of the target compiler, into the compiler metadata stream where it belongs.
      if (
        instance.options &&
        instance.options[property.name] &&
        Array.isArray(instance.options[property.name].targets) &&
        !instance.options[property.name].targets.includes(this.program.options.target)
      ) {
        // We are looking at a property that is either not a state or explicitly excluded by the host.
        continue;
      }

      const propertySpec = await this.processComponentProperty(
        property,
        instance[property.name],
        serializedData[property.name],
        targetComponent,
      );

      if (propertySpec) {
        spec.properties[property.name] = propertySpec;
      }
    }

    if (!this.output.processedComponents.has(name)) {
      const binding = await getBinding<BindingType>(this.program.options.target, targetComponent.source || '.', name);
      this.output.processedComponents.set(name, {spec, binding, instances: new Set()});
    }

    this.output.processedComponents.get(name)!.instances.add(instance);

    return spec;
  }

  /**
   * Runs the compilation routine, processing all local components and populating output based on the results.
   *
   * The compilation routine is not guaranteed to be idempotent, which is the reason `buildHot` resets output before running.
   */
  async run () {
    // Important: reset the require cache before each run.
    purgeRequireCache(require.resolve(this.program.emitRoot));
    const componentModule = await loadComponentModule(this.program.emitRoot);
    for (const componentName of this.program.localComponentNames) {
      const maybeConstructor = componentModule[componentName];
      if (!maybeConstructor) {
        Log.warning(`Unable to resolve component instance from ${this.program.projectRoot}: ${componentName}.`);
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
    return join(this.program.projectRoot, '.diez', `${this.program.options.target}-hot-url`);
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
      throw new Error(`Found existing hot URL at ${this.hotUrlMutex}. If this is an error, please manually remove the file.`);
    }

    exitTrap(() => this.cleanupHotUrlMutex());
    this.output.hotUrl = `http://${hostname}:${devPort}`;
    writeFileSync(this.hotUrlMutex, this.output.hotUrl);
  }

  /**
   * Starts the compiler. In dev mode, this will start a server with hot module reloading and continuously rebuild the SDK;
   * in production mode, this will write an SDK once and exit.
   */
  async start () {
    await this.validateOptions();
    if (this.program.hot) {
      const [devPort, hostname] = await Promise.all([getHotPort(), this.hostname()]);
      this.writeHotUrlMutex(hostname, devPort);

      if (!await this.buildHot()) {
        // TODO: make this retry without throwing.
        throw new Error('Unable to perform initial build.');
      }

      serveHot(
        this.program,
        this.hotComponent,
        devPort,
        this.hotStaticRoot,
      );
      // Important: only handle one Compiled event at a time to prevent races.
      this.program.on(CompilerEvent.Compiled, async () => {
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
    copySync(this.program.emitRoot, this.program.hotRoot);
    return true;
  }

  /**
   * Writes out bound assets from the target compiler's asset bindings.
   */
  writeAssets () {
    const staticRoot = this.program.hot ? this.hotStaticRoot : this.staticRoot;
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
