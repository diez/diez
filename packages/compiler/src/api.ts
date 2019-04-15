import {ConcreteComponentType} from '@diez/engine';
import {RequestHandler} from 'express';
import {Type} from 'ts-morph';

/**
 * A template handler factory, which receives a web project root and returns a suitable
 * request handler for serving assets from a template.
 */
export type TemplateHandlerFactory = (projectRoot: string) => RequestHandler;

/**
 * A generic interface for a compiler template.
 */
export interface TemplateProvider {
  path: string;
  factory: TemplateHandlerFactory;
}

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
   * The unique type name, used only for component properties.
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
export type CompilerTargetHandler = (
  projectRoot: string,
  destinationPath: string,
  localComponentNames: string[],
  namedComponentMap: NamedComponentMap,
  devMode: boolean,
  devPort?: number,
) => void;

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
