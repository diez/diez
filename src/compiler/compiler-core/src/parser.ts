/* tslint:disable:max-line-length ban-types */
import {Log} from '@diez/cli-core';
import {pascalCase} from 'change-case';
import {EventEmitter} from 'events';
import {existsSync} from 'fs-extra';
import {join, relative} from 'path';
import {ClassDeclaration, EnumDeclaration, ExportDeclaration, Expression, ImportDeclaration, Project, PropertyDeclaration, Scope, SourceFile, Symbol, ts, Type, TypeChecker, TypeGuards, VariableDeclaration} from 'ts-morph';
import {BuilderProgram, createSemanticDiagnosticsBuilderProgram, createWatchCompilerHost, createWatchProgram, Diagnostic, FormatDiagnosticsHost, formatDiagnosticsWithColorAndContext, Program, SymbolFlags, sys} from 'typescript';
import {v4} from 'uuid';
import {AcceptableType, CompilerEvent, CompilerOptions, DiezComponent, DiezType, DiezTypeMetadata, NamedComponentMap, Parser, PrimitiveType, PrimitiveTypes, PropertyReference} from './api';
import {getDescriptionForValue, getProject, isAcceptableType} from './utils';

/**
 * A [[Parser]] for a Diez project.
 * @noinheritdoc
 */
export class ProjectParser extends EventEmitter implements Parser {
  private readonly diagnosticsHost: FormatDiagnosticsHost = {
    getCurrentDirectory: sys.getCurrentDirectory,
    getNewLine: () => sys.newLine,
    getCanonicalFileName: (name) => name,
  };

  /**
   * In-memory pointers to the set of mutated source files.
   *
   * `ts-morph` might be overzealous in persisting to disk (for example, it will try to push our `__stub.ts` helper from
   * memory to disk), so we should carefully track the source files we mutate instead.
   */
  protected readonly mutatedSourceFiles = new Set<SourceFile>();

  /**
   * The wrapped TypeScript project.
   */
  protected readonly project: Project;

  /**
   * A typechecker capable of resolving any known types.
   */
  private readonly checker: TypeChecker;

  /**
   * The component declaration, which we can use to determine component-ness using the typechecker.
   */
  private readonly prefabDeclaration: ClassDeclaration;

  /**
   * An account of private type metadata.
   */
  private readonly typeManifest = new Map<DiezType, DiezTypeMetadata>();

  /**
   * The active TypeScript program.
   */
  private program: Program;

  /**
   * @ignore
   */
  private readonly types: PrimitiveTypes;

  /**
   * @ignore
   */
  readonly rootComponentNames = new Set<DiezType>();

  /**
   * @ignore
   */
  readonly components: NamedComponentMap;

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

  /**
   * Attach references recursively from an expression, typically originating as a property declaration in a class.
   *
   * Currently, we only support reference parsing from property access and "new ComponentName({})" expressions.
   *
   * Note: today, there is an implicit assumption of immutability in reference tracking. This requirement can and should
   * be loosened in the future.
   */
  private attachReferencesFromExpression (path: string[], references: PropertyReference[], sourceMap: Map<string, string>, expression?: Expression) {
    // istanbul ignore if
    if (!expression) {
      return;
    }

    // Resolve simple property access expressions. This allows us to unwrap references like this:
    //   class Colors {
    //     purple = Color.rgba(...);
    //   }
    //
    //   const colors = new Colors();
    //
    //   class Palette {
    //     primary = colors.purple;
    //   }
    //
    // The expected return for Palette.primary is:
    // [{
    //   path: [],
    //   parentType: "Colors",
    //   name: "purple"
    // }]
    if (TypeGuards.isPropertyAccessExpression(expression)) {
      const predicate = expression.getExpression();
      const predicateType = this.checker.getTypeAtLocation(predicate);
      // Important: ensure any referenced types will be populated in `this.components`.
      // These are not necessarily root level components, but might be.
      const parentType = this.processType(predicateType, sourceMap);
      if (!parentType) {
        return;
      }
      // Carefully traverse down to our source file to ensure we are not looking at another module's type.
      // We can rely on the following calls not throwing and the casting below being correct due to the resolution of
      // `parentType` above.
      const predicateTypeValue = predicateType.getSymbolOrThrow().getValueDeclarationOrThrow() as AcceptableType;
      const predicateSourceFilePath = predicateTypeValue.getSourceFile();
      // istanbul ignore if
      if (predicateSourceFilePath.isFromExternalLibrary()) {
        return;
      }

      references.push({
        path,
        parentType,
        name: expression.getName(),
      });
      return;
    }

    // Resolve constructor expressions for prefabs. This allows us to unwrap references like this:
    //   class Colors {
    //     purple = Color.rgba(...);
    //   }
    //
    //   const colors = new Colors();
    //
    //   class Typography {
    //     heading1 = new Typograph({color: colors.purple, ...});
    //   }
    //
    // The expected return for Typography.heading1 is:
    // [{
    //   path: ["color"],
    //   parentType: "Colors",
    //   name: "purple"
    // }]
    if (TypeGuards.isNewExpression(expression)) {
      const data = expression.getArguments()[0];
      // For now, we can limit our scope of concern to object literal expressions.
      if (!data || !TypeGuards.isObjectLiteralExpression(data)) {
        return;
      }

      for (const propertyAssignment of data.getProperties()) {
        // Skip spread notation, methods, and anything else which might confound here.
        if (!TypeGuards.isPropertyAssignment(propertyAssignment)) {
          continue;
        }

        this.attachReferencesFromExpression(
          [...path, propertyAssignment.getName()],
          references,
          sourceMap,
          propertyAssignment.getInitializer(),
        );
      }
    }
  }

  private getReferencesFromPropertyDeclaration (propertyDeclaration: PropertyDeclaration, sourceMap: Map<string, string>): PropertyReference[] {
    const initializer = propertyDeclaration.getInitializer();
    if (!initializer) {
      return [];
    }

    const references: PropertyReference[] = [];
    this.attachReferencesFromExpression([], references, sourceMap, initializer);
    return references;
  }

  private storeTypeMetadata (predicate: ClassDeclaration | VariableDeclaration, typeValue: AcceptableType, typescriptType: Type): DiezType | undefined {
    const symbolName = predicate.getName();
    if (!symbolName) {
      return;
    }

    const type = pascalCase(symbolName);
    this.typeManifest.set(type, {
      symbolName,
      typescriptType,
      typeValue,
    });

    return type;
  }

  /**
   * Retrieves a globally unique type name for a symbol.
   *
   * This name is always cast to pascal case.
   */
  private getTypeForValueDeclaration (typeValue: AcceptableType, typescriptType: Type): DiezType | undefined {
    if (TypeGuards.isClassDeclaration(typeValue)) {
      return this.storeTypeMetadata(typeValue, typeValue, typescriptType);
    }

    const predicate = typeValue.getParent();
    if (!TypeGuards.isVariableDeclaration(predicate)) {
      // This should never happen in real life, but technically an unassigned object literal expression is valid TypeScript.
      return;
    }

    return this.storeTypeMetadata(predicate, typeValue, typescriptType);
  }

  /**
   * Processes a component type and attaches it to a preconstructed target component map.
   *
   * @returns `true` if we were able to process the type as a component.
   */
  private processType (typescriptType: Type, sourceMap: Map<string, string>, isRootComponent = false): DiezType | undefined {
    const typeSymbol = typescriptType.getSymbol();
    if (!typescriptType.isObject() || !typeSymbol) {
      return;
    }

    const typeValue = typeSymbol.getValueDeclaration();

    if (!isAcceptableType(typeValue)) {
      return;
    }

    const type = this.getTypeForValueDeclaration(typeValue, typescriptType);
    if (!type) {
      return;
    }

    if (this.components.has(type)) {
      const component = this.components.get(type)!;
      const metadata = this.typeManifest.get(type)!;
      if (metadata.typescriptType !== typescriptType) {
        // FIXME: we should be able to handle this by automatically renaming components (e.g. `Color`, `Color0`...).
        // We should be able to do this entirely within `getTypeValueForValueDeclaration`, using a `Map<Type, DiezType>`.
        Log.warning(`Encountered a duplicate component name: ${type}. Please ensure no component names are duplicated.`);

        return;
      }

      // Important: we may have encountered this type in a context before it appeared as an exported symbol of the Diez project.
      // This ensures that the list of root components is correct.
      if (isRootComponent) {
        component.isRootComponent = true;
        this.rootComponentNames.add(type);
      }

      // We have already encountered this type and can safely skip it.
      return type;
    }

    const children: Symbol[] = [];
    if (TypeGuards.isClassDeclaration(typeValue)) {
      if (typeValue.getBaseClass() === this.prefabDeclaration) {
        for (const symbol of typescriptType.getProperties()) {
          if (symbol.getFlags() !== SymbolFlags.Property) {
            continue;
          }
          children.push(symbol);
        }
      } else {
        // TODO: it might be feasible to unwrap static properties here as well. The utility of doing this isn't perfectly clear,
        //       but it might unlock checking static references if this is a desired feature.
        for (const property of typeValue.getInstanceProperties()) {
          if (property.getScope() !== Scope.Public) {
            continue;
          }

          children.push(typeSymbol.getMemberOrThrow(property.getName()));
        }
      }
    } else {
      for (const property of typeValue.getProperties()) {
        // TODO: support spread notation, etc.
        if (TypeGuards.isPropertyAssignment(property) || TypeGuards.isShorthandPropertyAssignment(property)) {
          children.push(typeSymbol.getMemberOrThrow(property.getName()));
        }
      }
    }

    // Note if the object in question is fixed, i.e. receives no constructor arguments. This is true of all anonymous types (object literals).
    let constructorClass: ClassDeclaration | undefined = TypeGuards.isClassDeclaration(typeValue) ? typeValue : undefined;
    while (constructorClass && !constructorClass.getConstructors().length) {
      constructorClass = constructorClass.getBaseClass();
    }

    const sourcePath = typeValue.getSourceFile().getFilePath();
    const sourceModule = sourceMap.get(sourcePath);
    const sourceFile = (sourceModule !== undefined && sourceModule !== '.') ? undefined : relative(this.projectRoot, sourcePath);

    const newTarget: DiezComponent = {
      isRootComponent,
      type,
      sourceFile,
      isFixedComponent: !constructorClass || constructorClass.getConstructors().every(
        (constructor) => !constructor.getParameters().length),
      properties: [],
      warnings: {
        ambiguousTypes: new Set(),
      },
      sourceModule: sourceModule || '.',
      description: getDescriptionForValue(typeValue),
    };

    for (const typeMember of children) {
      const valueDeclaration = typeMember.getValueDeclaration() as PropertyDeclaration;
      if (!valueDeclaration) {
        // This should never happen?
        continue;
      }
      const propertyName = valueDeclaration.getName();
      const description = getDescriptionForValue(valueDeclaration);
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

      const references = this.getReferencesFromPropertyDeclaration(valueDeclaration, sourceMap);

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
          newTarget.properties.push({
            depth,
            description,
            references,
            name: propertyName,
            isComponent: false,
            type: primitiveType,
          });

        }
        continue;
      }

      // TODO: deal with propertyType.isUnion().
      if (propertyType.isUnion()) {
        // The type system cannot tolerate non-primitive union types not handled above.
        newTarget.warnings.ambiguousTypes.add(propertyName);
        continue;
      }

      const diezType = this.processType(propertyType, sourceMap);
      if (!diezType) {
        continue;
      }

      newTarget.properties.push({
        depth,
        description,
        references,
        name: propertyName,
        isComponent: true,
        type: diezType,
        parentType: type,
      });
    }

    this.components.set(type, newTarget);
    return type;
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

  getMetadataForTypeOrThrow (type: DiezType) {
    const manifest = this.typeManifest.get(type);
    if (!manifest) {
      throw new Error(`Type not found in type manifest: ${type}`);
    }
    return manifest;
  }

  /**
   * Runs the compiler and emits to listeners.
   */
  async run (throwOnErrors = true) {
    this.components.clear();
    this.rootComponentNames.clear();
    this.typeManifest.clear();
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
        const typescriptType = this.checker.getTypeAtLocation(exportDeclaration);
        const diezType = this.processType(typescriptType, sourceMap, true);
        if (diezType) {
          this.rootComponentNames.add(diezType);
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
  protected printDiagnostics (diagnostics: Diagnostic | ReadonlyArray<Diagnostic>) {
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
          // Write out to the expected directory.
          outDir: this.emitRoot,
        },
      ),
      sys,
      createSemanticDiagnosticsBuilderProgram,
      (diagnostic) => this.printDiagnostics(diagnostic),
      (diagnostic) => this.printDiagnostics(diagnostic),
    );

    // Skip watch status change notifications.
    host.onWatchStatusChange = () => {
      this.hotBuildStartTime = Date.now();
    };

    host.afterProgramCreate = (watchProgram) => {
      this.watchProgram = watchProgram;
      this.program = watchProgram.getProgram();

      const changedFiles = watchProgram.getState().changedFilesSet;

      if (changedFiles) {
        for (const file of changedFiles.keys()) {
          Log.info(`Refresing: ${file}`);
          this.project.getSourceFileOrThrow(file).refreshFromFileSystemSync();
        }
      }

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

  /**
   * Gets the component specification for a given property type.
   */
  getComponentForTypeOrThrow (type: DiezType): DiezComponent {
    const component = this.components.get(type);
    if (!component) {
      throw new Error(`Unable to resolve type ${type} from Parser. Aborting.`);
    }

    return component;
  }

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
      join(this.projectRoot, 'src', '__stub.ts'),
      'import {Prefab, Integer, Float} from \'@diez/engine\';',
      {overwrite: true},
    );

    const [prefabImport, intImport, floatImport] = stubTypeFile.getImportDeclarationOrThrow('@diez/engine').getNamedImports();
    this.components = new Map();
    this.prefabDeclaration = this.checker.getTypeAtLocation(prefabImport).getSymbolOrThrow().getValueDeclarationOrThrow() as ClassDeclaration;
    this.types = {
      [PrimitiveType.Int]: intImport.getSymbolOrThrow().getDeclaredType(),
      [PrimitiveType.Float]: floatImport.getSymbolOrThrow().getDeclaredType(),
    };
  }
}
