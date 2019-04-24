/* tslint:disable:max-line-length */
import {info, warning} from '@diez/cli';
import {ConcreteComponent} from '@diez/engine';
import {EventEmitter} from 'events';
import {copySync, ensureDirSync, existsSync, outputFileSync, readJsonSync, removeSync} from 'fs-extra';
import {dirname, join, resolve} from 'path';
import {ClassDeclaration, EnumDeclaration, Project, PropertyDeclaration, Type, TypeChecker} from 'ts-morph';
import {CompilerOptions, createSemanticDiagnosticsBuilderProgram, createWatchCompilerHost, createWatchProgram, Diagnostic, findConfigFile, FormatDiagnosticsHost, formatDiagnosticsWithColorAndContext, getPreEmitDiagnostics, isClassDeclaration, Program, sys} from 'typescript';
import {CompilerEvent, CompilerProgram, MaybeNestedArray, NamedComponentMap, PrimitiveType, PrimitiveTypes, PropertyType, TargetBinding, TargetComponent, TargetComponentProperty, TargetComponentSpec, TargetOutput, TargetProperty} from './api';
import {serveHot} from './server';
import {getBinding, getHotPort, getNodeModulesSource, loadComponentModule, purgeRequireCache} from './utils';

/**
 * A class implementing the requirements of Diez compilation.
 */
export class Compiler extends EventEmitter implements CompilerProgram {
  private readonly diagnosticsHost: FormatDiagnosticsHost = {
    getCurrentDirectory: sys.getCurrentDirectory,
    getNewLine: () => sys.newLine,
    getCanonicalFileName: (name) => name,
  };

  readonly tsConfigFilePath: string;
  readonly project: Project;
  readonly checker: TypeChecker;
  readonly targetComponents: NamedComponentMap;
  readonly componentDeclaration: ClassDeclaration;
  readonly localComponentNames: PropertyType[];
  readonly types: PrimitiveTypes;
  private program: Program;

  private validateProject () {
    const mainFilePath = join(this.projectRoot, 'src', 'index.ts');
    const packageJsonFilePath = join(this.projectRoot, 'package.json');
    if (!existsSync(mainFilePath)) {
      throw new Error(`Unable to proceed: no main file found at ${mainFilePath}`);
    }
    if (!existsSync(packageJsonFilePath)) {
      throw new Error(`Unable to proceed: no package.json file found at ${packageJsonFilePath}`);
    }

    const tsConfig = readJsonSync(this.tsConfigFilePath, {throws: false}) as {compilerOptions: CompilerOptions};
    if (
      !tsConfig ||
      !tsConfig.compilerOptions ||
      tsConfig.compilerOptions.rootDir !== 'src' ||
      tsConfig.compilerOptions.outDir !== 'lib'
    ) {
      throw new Error(
        `Unable to proceed: TypeScript configuration at ${this.tsConfigFilePath} does not compile from src/ to lib/. Please fix the TypeScript configuration and try again.`);
    }

    const packageJson = readJsonSync(packageJsonFilePath, {throws: false});
    if (!packageJson || packageJson.main !== 'lib/index.js') {
      throw new Error(`Unable to proceed: the package configuration at ${packageJsonFilePath} does not use lib/index.js as an entry point. Please fix the package configuration and try again.`);
    }
  }

  /**
   * Returns the primitive type of an enum type.
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

  /**
   * Processes a component type and attaches it to a preconstructed target component map.
   *
   * @param type - The type to process.
   *
   * @returns `true` if we were able to process the type as a component.
   */
  private processType (type: Type) {
    const typeSymbol = type.getSymbol();
    if (!type.isObject() || !typeSymbol) {
      return false;
    }

    const typeValue = typeSymbol.getValueDeclaration() as ClassDeclaration;
    if (!isClassDeclaration(typeValue.compilerNode)) {
      // FIXME: we are catching methods in this net as well, but should not.
      return false;
    }

    const componentName = typeValue.getName();
    if (!componentName) {
      // FIXME: we should be able to handle this by automatically generating anonymous componenet names.
      warning('Encountered an unnamed component class. Components without names are skipped.');
      return false;
    }

    if (
      this.targetComponents.has(componentName)
    ) {
      if (this.targetComponents.get(componentName)!.type !== type) {
        // FIXME: we should be able to handle this by automatically renaming components (e.g. `Color`, `Color0`…).
        warning(`Encountered a duplicate component name: ${componentName}. Please ensure no component names are duplicated.`);
        return false;
      }

      return true;
    }

    if (typeValue.getBaseClass() !== this.componentDeclaration) {
      return false;
    }

    const newTarget: TargetComponent = {
      type,
      properties: [],
      warnings: {
        ambiguousTypes: new Set(),
      },
    };

    for (const typeMember of typeSymbol.getMembers()) {
      const valueDeclaration = typeMember.getValueDeclaration() as PropertyDeclaration;
      if (!valueDeclaration) {
        // We will skip e.g. @typeparams here.
        continue;
      }
      const propertyName = valueDeclaration.getName();
      let propertyType = this.checker.getTypeAtLocation(valueDeclaration);

      // Process array type depth.
      // TODO: support tuples and other iterables.
      let depth = 0;
      while (propertyType && propertyType.isArray()) {
        depth++;
        propertyType = propertyType.getArrayType()!;
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
          newTarget.properties.push({depth, name: propertyName, isComponent: false, type: primitiveType});
        }
        continue;
      }

      // TODO: deal with propertyType.isUnion().
      if (propertyType.isUnion()) {
        // The type system cannot tolerate non-primitive union types not handled above.
        newTarget.warnings.ambiguousTypes.add(propertyName);
        continue;
      }

      if (!this.processType(propertyType)) {
        continue;
      }

      const candidateSymbol = propertyType.getSymbolOrThrow();

      newTarget.properties.push({
        depth,
        name: propertyName,
        isComponent: true,
        type: candidateSymbol.getName(),
      });
    }

    const sourceFile = typeValue.getSourceFile();
    if (sourceFile.isInNodeModules()) {
      newTarget.source = getNodeModulesSource(sourceFile.getFilePath());
    }

    this.targetComponents.set(componentName, newTarget);
    return true;
  }

  private run (throwOnErrors = false) {
    if (throwOnErrors) {
      const diagnostics = getPreEmitDiagnostics(this.program);
      if (diagnostics.length) {
        this.printDiagnostics(diagnostics);
        throw new Error('Unable to compile project!');
      }
    }

    this.targetComponents.clear();
    this.localComponentNames.length = 0;
    this.compile();

    const sourceFile = this.project.getSourceFileOrThrow(join(this.projectRoot, 'src', 'index.ts'));
    info(`Unwrapping component types from ${resolve(this.projectRoot, 'src', 'index.ts')}...`);
    for (const exportDeclaration of sourceFile.getExportedDeclarations()) {
      const type = this.checker.getTypeAtLocation(exportDeclaration);
      if (this.processType(type)) {
        this.localComponentNames.push(type.getSymbolOrThrow().getName());
      }
    }

    this.emit(CompilerEvent.Compiled);
  }

  private compile () {
    info('Compiling project…');
    const emitResult = this.program.emit();
    this.printDiagnostics(emitResult.diagnostics);
    if (emitResult.emittedFiles) {
      info(`Compiled: ${emitResult.emittedFiles.join(', ')}.`);
    }
  }

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

  private watch () {
    const host = createWatchCompilerHost(
      this.tsConfigFilePath,
      {},
      sys,
      createSemanticDiagnosticsBuilderProgram,
      (diagnostic) => this.printDiagnostics(diagnostic),
      (diagnostic) => this.printDiagnostics(diagnostic),
    );

    host.afterProgramCreate = (watchProgram) => {
      this.program = watchProgram.getProgram();
      const diagnostics = getPreEmitDiagnostics(this.program);
      if (diagnostics.length) {
        this.printDiagnostics(diagnostics);
      } else {
        this.run();
      }
    };
    createWatchProgram(host);
  }

  constructor (
    readonly projectRoot: string,
    readonly destinationPath: string,
    readonly target: string,
    public devMode: boolean = false,
  ) {
    super();

    info(`Validating project structure at ${projectRoot}...`);
    this.tsConfigFilePath = findConfigFile(projectRoot, sys.fileExists, 'tsconfig.json')!;

    if (!this.tsConfigFilePath) {
      throw new Error('Unable to proceed: TypeScript configuration not found.');
    }

    this.validateProject();

    try {
      this.project = new Project({tsConfigFilePath: this.tsConfigFilePath});
    } catch (e) {
      throw new Error(`Found an invalid TypeScript configuration at ${this.tsConfigFilePath}. Please check its contents and try again.`);
    }

    this.program = this.project.getProgram().compilerObject;
    this.checker = this.project.getTypeChecker();

    // Create a stub type file for typing the Component class and number primitives.
    const stubTypeFile = this.project.createSourceFile(
      'src/__stub.ts',
      "import {Component, Integer, Float} from '@diez/engine';",
    );

    const [componentImport, intImport, floatImport] = stubTypeFile.getImportDeclarationOrThrow('@diez/engine').getNamedImports();
    this.targetComponents = new Map();
    this.componentDeclaration = this.checker.getTypeAtLocation(componentImport).getSymbolOrThrow().getValueDeclarationOrThrow() as ClassDeclaration;
    this.types = {
      [PrimitiveType.Int]: intImport.getSymbolOrThrow().getDeclaredType(),
      [PrimitiveType.Float]: floatImport.getSymbolOrThrow().getDeclaredType(),
    };

    this.localComponentNames = [];

    if (this.devMode) {
      this.watch();
    } else {
      this.run(true);
    }
  }
}

/**
 * An abstract class wrapping the basic functions of a target compiler.
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
   * Updates a output based on the contents of bindings.
   */
  protected abstract mergeBindingToOutput (binding: BindingType): void;

  /**
   * Creates fresh output.
   */
  protected abstract createOutput (sdkRoot: string): OutputType;

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
   * The hostname for hot serving.
   */
  abstract hostname (): Promise<string>;

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
   * Writes the transpiled SDK for an optional hot hostname and dev port.
   */
  abstract async writeSdk (hostname?: string, devPort?: number): Promise<void>;

  constructor (readonly program: CompilerProgram, sdkRoot: string) {
    this.output = this.createOutput(sdkRoot);
  }

  /**
   * Generates a fresh component spec for a given type.
   */
  protected createSpec (type: PropertyType): TargetComponentSpec {
    return {componentName: type, properties: {}, public: this.program.localComponentNames.includes(type)};
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
        this.program.target, propertyComponent.source || '.', property.type);
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
        initializer: this.getInitializer(componentSpec),
      };
    }

    return this.getPrimitive(property.type, serializedInstance);
  }

  /**
   * Recursively processes a component instance and all its properties.
   */
  protected async processComponentInstance (instance: ConcreteComponent, name: PropertyType) {
    const targetComponent = this.program.targetComponents.get(name);
    if (!targetComponent) {
      warning(`Unable to find component definition for ${name}!`);
      return;
    }

    const spec = this.createSpec(name);

    for (const property of targetComponent.properties) {
      const propertyOptions = instance.boundStates.get(property.name);
      if (!propertyOptions || (propertyOptions.targets && !propertyOptions.targets.includes(this.program.target))) {
        // We are looking at a property that is either not a state or explicitly excluded by the host.
        continue;
      }

      const propertySpec = await this.processComponentProperty(
        property,
        instance.get(property.name),
        instance.serialize()[property.name],
        targetComponent,
      );

      if (propertySpec) {
        spec.properties[property.name] = propertySpec;
      }
    }

    if (!this.output.processedComponents.has(name)) {
      const binding = await getBinding<BindingType>(this.program.target, targetComponent.source || '.', name);
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
    purgeRequireCache(require.resolve(this.program.projectRoot));
    const componentModule = await loadComponentModule(this.program.projectRoot);
    for (const componentName of this.program.localComponentNames) {
      const constructor = componentModule[componentName];
      if (!constructor) {
        warning(`Unable to resolve component instance from ${this.program.projectRoot}: ${componentName}.`);
        continue;
      }

      const componentInstance = new constructor();
      await this.processComponentInstance(componentInstance, componentName);
    }
  }

  /**
   * Starts the compiler. In dev mode, this will start a server with hot module reloading and continuously rebuild the SDK;
   * in production mode, this will write an SDK once and exit.
   */
  async start () {
    if (this.program.devMode) {
      const devPort = await getHotPort();
      await this.runHot(async () => {
        this.writeSdk(await this.hostname(), devPort);
      });

      await serveHot(
        this.program.projectRoot,
        this.hotComponent,
        devPort,
        this.staticRoot,
      );
    } else {
      await this.run();
      await this.writeSdk();
    }

    this.printUsageInstructions();
  }

  /**
   * @internal
   */
  private async buildHot (writeSdkCommand: () => Promise<void>) {
    info('Rebuilding.');
    this.output = this.createOutput(this.output.sdkRoot);
    await this.run();
    await writeSdkCommand();
    copySync(join(this.program.projectRoot, 'lib'), join(this.program.projectRoot, '.diez'));
  }

  /**
   * Runs hot, listening for compile events.
   */
  async runHot (writeSdkCommand: () => Promise<void>) {
    this.program.on(CompilerEvent.Compiled, async () => {
      await this.buildHot(writeSdkCommand);
    });

    // Write the SDK once before we start listening.
    await this.buildHot(writeSdkCommand);
  }

  /**
   * Writes out bound assets from the target compiler's asset bindings.
   */
  writeAssets () {
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
  }
}
