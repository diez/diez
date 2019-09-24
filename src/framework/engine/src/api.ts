/**
 * A serializable interface for providing bespoke serialization instructions. Can return anything
 * recursively serializable.
 */
export interface Serializable<T> {
  serialize (): T;
}

/**
 * A patcher takes any serializable payload and patches it up to its controller.
 */
export type Patcher = (payload: any) => void;

/**
 * A typed hashmap mapping string keys to objects of a specific type.
 */
export interface HashMap<T> {
  [key: string]: T;
}

/**
 * @internal
 *
 * Since TypeScript doesn't provide proper Integer/Double types, we hack around this by making named types
 * using a union of `number` and an empty enum.
 */
enum AlwaysInt {}
enum AlwaysFloat {}

/**
 * Typealias for integer numbers. As a superset of JavaScript, TypeScript does not distinguish between integer numbers
 * and floating point numbers, so this type can be used to resolve ambiguities.
 */
export type Integer = number | AlwaysInt;

/**
 * Typealias for floating point numbers. As a superset of JavaScript, TypeScript does not distinguish between integer
 * numbers and floating point numbers, so this type can be used to resolve ambiguities.
 */
export type Float = number | AlwaysFloat;

/**
 * An enum of available compiler targets.
 *
 * This enum can be augmented as needed by third party compilers.
 *
 * Note: it is important for this to be a `const enum` to enable proper third-party augmentation.
 */
export const enum Target {
  Android = 'android',
  Ios = 'ios',
  Web = 'web',
}

/**
 * An expandable interface for property options.
 */
export interface PropertyOptions {
  /**
   * The list of targets a property should target.
   */
  targets: Target[];
}
