import {PropertyOptions, Serializable} from './api';
import {serialize} from './serialization';

/**
 * The abstract Prefab class provides a harness for reusable, instantiable design token prefabs.
 *
 * IMPORTANT: never extend this class directly. Due to the type semantics of Prefab instances--which should both store
 * and implement the interface of their generic type parameters--we provide a factory ensuring intuitive typing.
 *
 * See [[prefab]] for details.
 * @typeparam T - The interface the prefab data, as well as the prefab itself, must adhere to.
 */
export abstract class Prefab<T extends object> implements Serializable<T> {
  /**
   * The component that is hosting us.
   */
  host?: Prefab<any>;

  /**
   * Every concrete extension must implement exhaustive defaults conforming to the data interface.
   */
  readonly abstract defaults: Readonly<T>;

  /**
   * If necessary, options may be defined.
   */
  readonly options: Partial<{[K in keyof T]: Partial<PropertyOptions>}> = {};

  constructor (private readonly overrides: Partial<T> = {}) {
    // Build a proxy through which we can implement T, which is not statically known at compile time.
    const proxy = new Proxy(this, this);

    // Pluck the defined overrides from the constructor argument.
    this.overrides = {};
    for (const key of Object.keys(overrides) as (keyof T)[]) {
      if (overrides[key] !== undefined) {
        if (typeof overrides[key] === 'object') {
          (overrides[key] as any).host = proxy;
        }
        this.overrides[key] = overrides[key];
      }
    }

    return proxy;
  }

  /**
   * Proxy method, by which we subtly implement the data interface in the class itself.
   */
  get (instance: any, key: string, receiver: any) {
    if (instance[key] instanceof Function) {
      return instance[key].bind(receiver);
    }

    if (instance[key] !== undefined) {
      return instance[key];
    }

    if (instance.overrides.hasOwnProperty(key)) {
      return instance.overrides[key];
    }

    return instance.defaults[key];
  }

  /**
   * A local data sanitizer, which can be used for pinning scalar values and any other data normalization needs.
   */
  protected sanitize (data: T): T {
    return data;
  }

  /**
   * Serializable<T> interface.
   *
   * Generic serialization instructions. These can be overridden as needed.
   */
  serialize () {
    return serialize(this.sanitize(Object.assign(this.defaults, this.overrides)));
  }
}

/**
 * A typing which acknowledges the Proxy by which Prefab<T> actually implements T.
 */
type PrefabConstructor<T extends object> = new (overrides?: Partial<T>) => Prefab<T> & T;

/**
 * A factory for prefab base classes. All prefabs should be implemented as concrete classes extending
 * the result of calling `prefab<T>()` for some specific state shape `T`.
 * @typeparam T - The interface the prefab data, as well as the prefab itself, must adhere to.
 */
export const prefab = <T extends object>(): PrefabConstructor<T> =>
  Prefab.prototype.constructor as PrefabConstructor<T>;
