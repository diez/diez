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
 * JSDoc description of a property.
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
 * in a [[TargetCompiler]] extension.
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
 * Provides addressable types for component properties.
 *
 * Strings represent globally unique component names, and the integer enum type [[PrimitiveType]] represents all others.
 */
export type PropertyType = string | PrimitiveType;

/**
 * A component compiler property descriptor.
 */
export interface TargetProperty {
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
}

/**
 * Component-specific warnings which can be printed after a compiler run.
 */
export interface TargetComponentWarnings {
  /**
   * Properties that have ambiguous/unresolved types.
   */
  ambiguousTypes: Set<string>;
}

/**
 * A component descriptor, used by the compiler.
 */
export interface TargetComponent {
  /**
   * The set of compilable properties for the component.
   */
  properties: TargetProperty[];
  /**
   * The wrapped TypeScript type of the component. Used mainly for detecting naming collisions.
   */
  type?: Type;
  /**
   * The resolvable module that provides the property's component type. Used for assembling bindings for
   * some compiler targets.
   */
  source: string;
  /**
   * Warnings encountered while attempting to compile this component.
   */
  warnings: TargetComponentWarnings;
  /**
   * Description of the component.
   */
  description: PropertyDescription;
}

/**
 * A named component map, provided as the main compiler input.
 */
export type NamedComponentMap = Map<PropertyType, TargetComponent>;

/**
 * Compiler target handlers perform the actual work of compilation, and are triggered with `diez compile`.
 */
export type CompilerTargetHandler = (program: CompilerProgram) => Promise<void>;

/**
 * A generic interface for a compiler target.
 */
export interface CompilerTargetProvider {
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
export interface CompilerProgram extends EventEmitter {
  /**
   * A map of (unique!) component names to target component specifications. This is derived recursively
   * and includes both prefabs from external modules and local components.
   */
  targetComponents: NamedComponentMap;
  /**
   * The names of local components encountered during compiler execution.
   */
  localComponentNames: Set<PropertyType>;
  /**
   * The names of singleton components encountered during compiler execution.
   */
  singletonComponentNames: Set<PropertyType>;
  /**
   * The root of the project whose local components we should compile.
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
  program: CompilerProgram,
  output: OutputType,
  spec: TargetComponentSpec,
  property: TargetProperty,
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
 * Specifies a component property.
 */
export interface TargetComponentProperty {
  type: PropertyType;
  initializer: string;
  isPrimitive: boolean;
  depth: number;
}

/**
 * Specifies an entire component.
 */
export interface TargetComponentSpec {
  componentName: PropertyType;
  properties: {[name: string]: TargetComponentProperty};
  public: boolean;
}

/**
 * Provides a ledger for a target spec, keeping track of both component specs and instances.
 *
 * Resolves ambiguity between singletons and reusable components.
 */
export interface TargetSpecLedger<Binding> {
  spec: TargetComponentSpec;
  instances: Set<object>;
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
  processedComponents: Map<PropertyType, TargetSpecLedger<Binding>>;
  dependencies: Set<Dependency>;
  assetBindings: AssetBindings;
  projectName: string;
  sdkRoot: string;
}

/**
 * Provides a base binding interfaces for target compilers can extend as needed.
 */
export interface TargetBinding<
  T extends Prefab<any> = Prefab<any>,
  OutputType = TargetOutput,
> {
  sources: string[];
  assetsBinder?: AssetBinder<T, OutputType>;
}

/**
 * A general type for an object that supports construction.
 * @ignore
 */
export type Constructor = new () => object;
