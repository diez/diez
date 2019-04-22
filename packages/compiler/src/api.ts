import {Component, ConcreteComponent, ConcreteComponentType} from '@diez/engine';
import {EventEmitter} from 'events';
import {Express, RequestHandler} from 'express';
import {ClassDeclaration, Project, Type, TypeChecker} from 'ts-morph';
import {Configuration} from 'webpack';

/**
 * A template handler factory, which receives a web project root and returns a suitable
 * request handler for serving assets from a template.
 */
export type TemplateHandlerFactory = (projectRoot: string) => RequestHandler;

/**
 * Modifies a webpack configuration before hot serving to provide platform-specific functionality.
 */
export type WebpackConfigModifier = (config: Configuration) => void;

/**
 * Modifies a hot server to provide platform-specific functionality.
 */
export type HotServerModifier = (app: Express, projectRoot: string) => void;

/**
 * Provides an arbitrarily nested array type, i.e. `T[] | T[][] | T[][] | …`.
 */
export interface NestedArray<T> extends Array<T | NestedArray<T>> {}

/**
 * Provides an arbitrarily nested array type with support for no nesting, i.e. `T | T[] | T[][] | …`.
 */
export type MaybeNestedArray<T> = T | NestedArray<T>;

/**
 * Names of primitive types.
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
   * If specified, the resolvable module that provides the property's component type. Used for assembling bindings for
   * some compiler targets.
   */
  source?: string;
  /**
   * Warnings encountered while attempting to compile this component.
   */
  warnings: TargetComponentWarnings;
}

/**
 * A named component map, provided as the main compiler input.
 */
export type NamedComponentMap = Map<PropertyType, TargetComponent>;

/**
 * Compiler target handlers perform the actual work of compilation.
 */
export type CompilerTargetHandler = (program: CompilerProgram) => void;

/**
 * A generic interface for a compiler target.
 */
export interface CompilerTargetProvider {
  name: string;
  handler: CompilerTargetHandler;
}

/**
 * The expected shape of a component module.
 */
export interface ComponentModule {
  [key: string]: ConcreteComponentType;
}

/**
 * Collects reserved types.
 */
export interface PrimitiveTypes {
  [PrimitiveType.Int]: Type;
  [PrimitiveType.Float]: Type;
}

/**
 * A complete compiler program.
 */
export interface CompilerProgram extends EventEmitter {
  /**
   * A typechecker capable of resolving any known types.
   */
  checker: TypeChecker;
  /**
   * The source file providing the entry point for our compiler program.
   */
  project: Project;
  /**
   * The component declaration, which we can use to determine component-ness using the typechecker.
   */
  componentDeclaration: ClassDeclaration;
  /**
   * A collection of reserved types, used to resolve type ambiguities in key places.
   */
  types: PrimitiveTypes;
  /**
   * A map of (unique!) component names to target component specifications. This is derived recursively
   * and includes both prefabs from external modules and local components.
   */
  targetComponents: NamedComponentMap;
  /**
   * The names of local components encountered during compiler execution.
   */
  localComponentNames: PropertyType[];
  /**
   * The root of the project whose local components we should compile.
   */
  projectRoot: string;
  /**
   * The destination path of the project whose local components we should compile.
   */
  destinationPath: string;
  /**
   * Whether we are running the compiler in dev mode or not.
   */
  devMode: boolean;
}

/**
 * Provides a generic compile-time asset binding.
 */
export interface AssetBinding {
  contents: string | Buffer;
  copy?: boolean;
}

/**
 * Provides 0 or more bindings from a component instance.
 */
export type AssetBinder<T extends Component> = (
  instance: T,
  projectRoot: string,
  bindings: Map<string, AssetBinding>,
) => Promise<void>;

/**
 * An enum for build events.
 */
export enum CompilerEvent {
  /**
   * Sent by the compiler after it has processed the TypeScript AST and successfully compiled.
   */
  Compiled = 'compiled',
}

/**
 * Specifies a component property.
 */
export interface TargetComponentProperty {
  type: PropertyType;
  updateable: boolean;
  initializer: string;
}

/**
 * Specifies an entire component.
 */
export interface TargetComponentSpec<T = TargetComponentProperty> {
  componentName: PropertyType;
  properties: {[name: string]: T};
  public: boolean;
}

/**
 * Provides a ledger for a target spec, keeping track of both component specs and instances.
 *
 * Resolves ambiguity between singletons and reusable components.
 */
export interface TargetSpecLedger<Spec, Binding> {
  spec: Spec;
  instances: Set<ConcreteComponent>;
  binding?: Binding;
}

/**
 * Provides a base target output interface targets can extend as needed.
 */
export interface TargetOutput<
  Dependency = {},
  Binding = {},
  Spec = TargetComponentSpec,
> {
  processedComponents: Map<PropertyType, TargetSpecLedger<Spec, Binding>>;
  sources: Set<string>;
  dependencies: Set<Dependency>;
  assetBindings: Map<string, AssetBinding>;
  sdkRoot: string;
}
