import {Prefab, Target} from '@diez/engine';
import {EventEmitter} from 'events';
import {Type} from 'ts-morph';

declare module '@diez/cli-core/types/api' {
  /**
   * Extends FullDiezConfiguration for the compiler.
   */
  export interface FullDiezConfiguration {
    /**
     * Bindings, which associate a namespaced component to a [[TargetBinding]].
     */
    bindings: {
      [componentHash: string]: TargetBinding;
    };
    projectRoot: string;
  }
}

/**
 * Flag-based compiler options, which can be augmented by targets as needed.
 */
export interface CompilerOptions {
  target: Target;
  sdkVersion: string;
}

/**
 * The description of a property, providing context and meaning beyond the type of the property.
 */
export interface PropertyDescription {
  body: string;
}

/**
 * Provides an arbitrarily nested array type, i.e. `T[] | T[][] | T[][] | ...`.
 *
 * @typeparam T - The type of the nested array. Must be a type supported by the Diez compiler; that is, either a
 *                primitive type or [[Component]].
 */
export interface NestedArray<T> extends Array<T | NestedArray<T>> {}

/**
 * Provides an arbitrarily nested array type with support for 0 or more levels of nesting, i.e. `T | T[] | T[][] | ...`.
 *
 * @typeparam T - The type of the nested array. Must be a type supported by the Diez compiler; that is, either a
 *                primitive type or [[Component]].
 */
export type MaybeNestedArray<T> = T | NestedArray<T>;

/**
 * Names of supported primitive types.
 *
 * The enum members are typically checked during postpressing when implementing the abstract [[getPrimitive]] method
 * in a [[Compiler]] extension.
 */
export enum PrimitiveType {
  Unknown = 0,
  Boolean = 1,
  String = 2,
  Number = 3,
  Float = 3,
  Int = 4,
}

/**
 * Component-specific warnings which can be printed after a compiler run.
 */
export interface DiezComponentWarnings {
  /**
   * Properties that have ambiguous/unresolved types.
   */
  ambiguousTypes: Set<string>;
}

/**
 * Provides addressable types for component properties.
 *
 * Strings represent globally unique component names, and the integer enum type [[PrimitiveType]] represents all others.
 */
export type PropertyType = string | PrimitiveType;

/**
 * A source reference for a property. If a property is defined using a reference to another property, we can unpack
 * using a a `PropertyReference` descriptor.
 */
export interface PropertyReference {
  /**
   * The path to the referenced property.
   */
  path: string[];
  /**
   * The type of the property's parent.
   */
  parentType: PropertyType;
  /**
   * The name of the property from the parent.
   */
  name: string;
}

/**
 * A component compiler property descriptor.
 */
export interface Property {
  /**
   * The name of the property.
   */
  name: string;
  /**
   * Whether the property is a component or a primitive (e.g. string, number, enum member, etc.)
   */
  isComponent: boolean;
  /**
   * The depth of the target property. This allows arbitrary-order list types.
   */
  depth: number;
  /**
   * The unique type name.
   */
  type: PropertyType;
  /**
   * The name of the host of the property.
   */
  parentType?: PropertyType;
  /**
   * Description of the property.
   */
  description: PropertyDescription;
  /**
   * Any references encountered while parsing the property.
   */
  references: PropertyReference[];
}

/**
 * A component descriptor, used by the compiler.
 */
export interface DiezComponent {
  /**
   * The set of compilable properties for the component.
   */
  properties: Property[];
  /**
   * The wrapped TypeScript type of the component. Used mainly for detecting naming collisions.
   *
   * This value should never be serialized.
   */
  typescriptType?: Type;
  /**
   * The unique type name.
   */
  type: PropertyType;
  /**
   * The resolvable module that provides the property's component type. Used for assembling bindings for
   * some compiler targets.
   */
  sourceModule: string;
  /**
   * The source file where the property's component is declared. Only set for root components.
   */
  sourceFile?: string;
  /**
   * Warnings encountered while attempting to compile this component.
   */
  warnings: DiezComponentWarnings;
  /**
   * Description of the component.
   */
  description: PropertyDescription;
  /**
   * Whether this is a "root component"—one whose definition is exported by a project.
   */
  isRootComponent: boolean;
  /**
   * Whether this is a "fixed component"—one whose constructor does not receive arguments.
   */
  isFixedComponent: boolean;
}

/**
 * A named component map, provided as the main compiler input.
 */
export type NamedComponentMap = Map<PropertyType, DiezComponent>;

/**
 * Compiler target handlers perform the actual work of compilation, and are triggered with `diez compile`.
 */
export type CompilerTargetHandler = (parser: Parser) => Promise<void>;

/**
 * A generic interface for a compiler target.
 */
export interface CompilerProvider {
  name: Target;
  handler: CompilerTargetHandler;
}

/**
 * The expected shape of a component module.
 * @ignore
 */
export interface ComponentModule {
  [key: string]: object | Constructor;
}

/**
 * Collects reserved types.
 * @ignore
 */
export interface PrimitiveTypes {
  [PrimitiveType.Int]: Type;
  [PrimitiveType.Float]: Type;
}

/**
 * A complete compiler program.
 * @noinheritdoc
 */
export interface Parser extends EventEmitter {
  /**
   * A map of (unique!) component names to target component specifications. This is derived recursively
   * and includes both prefabs from external modules and root components.
   */
  components: NamedComponentMap;
  /**
   * The names of root components encountered during compiler execution.
   */
  rootComponentNames: Set<PropertyType>;
  /**
   * The root of the project whose root components we should compile.
   */
  projectRoot: string;
  /**
   * Our compiler options.
   */
  options: CompilerOptions;
  /**
   * Where we should emit source code.
   * @ignore
   */
  emitRoot: string;
  /**
   * Whether we are running hot.
   * @ignore
   */
  hot: boolean;
  /**
   * Where we should emit hot code.
   * @ignore
   */
  hotRoot: string;
  /**
   * The hot build start time.
   * @ignore
   */
  hotBuildStartTime: number;
  /**
   * A method for retrieving a component for a type.
   */
  getComponentForTypeOrThrow (type: PropertyType): DiezComponent;
}

/**
 * Provides a generic compile-time asset binding.
 */
export interface AssetBinding {
  /**
   * The contents of the bound asset.
   */
  contents: string | Buffer;
  /**
   * If `true`, `contents` is expected to hold the path of a source file or a buffered reader instead of a source
   * string.
   */
  copy?: boolean;
}

/**
 * Provides 0 or more bindings from a component instance.
 */
export type AssetBinder<
  ComponentType extends object,
  OutputType = TargetOutput,
> = (
  instance: ComponentType,
  parser: Parser,
  output: OutputType,
  targetComponent: TargetDiezComponent,
  property: Property,
) => Promise<void>;

/**
 * An enum for build events.
 * @ignore
 */
export enum CompilerEvent {
  /**
   * Sent by the compiler after it has processed the TypeScript AST and successfully compiled.
   */
  Compiled = 'compiled',
  /**
   * Sent by the compiler when it encounters an error.
   */
  Error = 'compilerError',
}

/**
 * A property extension that includes a target-specific initializer.
 */
export interface TargetProperty extends Property {
  /**
   * A code string (typically generated) for initializing this property at runtime in a Diez SDK.
   */
  initializer: string;
  /**
   * The canonical type of the original target property. We may mutate the type of the target property at runtime, e.g.
   * for specifying array/list types correctly or declaring primitives.
   */
  originalType?: PropertyType;
}

/**
 * Specifies an entire component.
 */
export interface TargetDiezComponent<Binding = {}> extends DiezComponent {
  properties: TargetProperty[];
  binding?: Binding;
}

/**
 * A map of relative asset paths to their compile-time bindings.
 */
export type AssetBindings = Map<string, AssetBinding>;

/**
 * Provides a base target output interface targets can extend as needed.
 */
export interface TargetOutput<
  Dependency = {},
  Binding = {},
> {
  hotUrl?: string;
  processedComponents: Map<PropertyType, TargetDiezComponent<Binding>>;
  dependencies: Set<Dependency>;
  assetBindings: AssetBindings;
  projectName: string;
  sdkRoot: string;
}

/**
 * Provides an interface to declare arbitrarily nested usage example trees.
 */
export interface UsageExampleTree {
  [key: string]: UsageExampleTree | UsageExample[];
}

/**
 * Provides a base interface to declare an usage example.
 */
export interface UsageExample {
  example?: string;
  comment?: string;
  snippets: UsageSnippet[];
}

interface BaseUsageSnippet {
  lang: string;
  data?: {[key: string]: any};
  helpers?: {[key: string]: () => string};
}

/**
 * Describes a snippet with a template located in an external file.
 */
interface TemplateFileUsageSnippet extends BaseUsageSnippet {
  templatePath: string;
}

/**
 * Describes a snippet with an inline template.
 */
interface TemplateLiteralUsageSnippet extends BaseUsageSnippet {
  template: string;
}

/**
 * Describes a snippet of example code.
 */
type UsageSnippet = TemplateFileUsageSnippet | TemplateLiteralUsageSnippet;

/**
 * Provides a base binding interface compilers can extend as needed.
 */
export interface TargetBinding<
  T extends Prefab<any> = Prefab<any>,
  OutputType = TargetOutput,
> {
  sources: string[];
  assetsBinder?: AssetBinder<T, OutputType>;
  examples?: UsageExampleTree | UsageExample[];
}

/**
 * A general type for an object that supports construction.
 * @ignore
 */
export type Constructor = new () => object;

/**
 * Provides a generic interface for assembling source files in compiler implementations and writing them to disk.
 *
 * @typeparam T - The [[TargetOutput]] used by the compiler for storing intermediate code.
 */
export interface Assembler<T extends TargetOutput> {
  /**
   * The [[TargetOutput]] used by the compiler for storing intermediate code.
   */
  output: T;

  /**
   * Assembles and (usually) writes out core files.
   *
   * TODO: package core files as separately bundled artifacts available via public repositories.
   *       Once this is complete, we likely no longer need to retain "core files" as a concept.
   */
  addCoreFiles (): Promise<void | void[]>;

  /**
   * Semantically write a file out to disk.
   */
  writeFile (destinationPath: string, contents: string | Buffer): Promise<any>;

  /**
   * Semantically copy a file to disk.
   */
  copyFile (sourcePath: string, destinationPath: string): Promise<any>;
}

/**
 * A factory for constructing an [[Assembler]].
 */
export type AssemblerFactory<T extends TargetOutput> = (output: T) => Assembler<T>;
