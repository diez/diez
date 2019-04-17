import {ConcreteComponentType} from '@diez/engine';
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
  type?: string;
}

/**
 * Component-specific warnings which can be printed after a compiler run.
 */
export interface TargetComponentWarnings {
  /**
   * Properties which are missing the @property decorator.
   */
  missingProperties: Set<string>;
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
  warnings?: TargetComponentWarnings;
}

/**
 * A named component map, provided as the main compiler input.
 */
export type NamedComponentMap = Map<string, TargetComponent>;

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
 * A complete compiler program.
 */
export interface CompilerProgram {
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
  types: {
    int: Type;
    float: Type;
  };
  /**
   * A map of (unique!) component names to target component specifications. This is derived recursively
   * and includes both prefabs from external modules and local components.
   */
  targetComponents: NamedComponentMap;
  /**
   * The names of local components encountered during compiler execution.
   */
  localComponentNames: string[];
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
