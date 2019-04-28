import {PropertyOptions} from './api';
import {Component} from './component';

/**
 * `@shared` decorator. Enables one-way data binding from a host component to its children, suitable for use in
 * expressions.
 * @ignore
 */
export const shared = (target: Component, key: string) => {
  Object.defineProperty(target, key, {
    get () {
      // Yield the value from our host if it is provided.
      if (this.host && this.host.has(key)) {
        return this.host.get(key);
      }

      throw new Error(`Shared property ${key} is not present on host.`);
    },
    set () {
      throw new Error('Do not set @shared values directly.');
    },
  } as ThisType<Component>);
};

/**
 * `@method` decorator. Late-binds methods to a class prototype by name key.
 * @ignore
 */
export const method = (target: any, key: string, descriptor: any) => {
  if (!target.listeners) {
    target.listeners = {};
  }
  target.listeners[key] = descriptor.value;
};

/**
 * @internal
 */
const actualProperty = (target: Component, key: string, options: Partial<PropertyOptions> = {}) => {
  Object.defineProperty(target, key, {
    get () {
      return this.get(key);
    },

    set (data: any) {
      // Important: only set the state if it is undefined at bind-time or has already been bound.
      // In the event that it is not undefined and unbound, it must have been overridden with a
      // construction-time value.
      if (this.get(key) === undefined || this.boundStates.get(key)) {
        this.set({[key]: data});
      }

      this.boundStates.set(key, options);

      // Important: if we detect that a data value is actually an expression, make sure it knows
      // to auto-resolve state names against itself unless otherwise specified.
      if (data && typeof data === 'object' && data.constructor.isExpression) {
        data.autoResolve(this);
      }
    },
  } as ThisType<Component>);
};

export function property (target: Component, key: string): void;
export function property (options: Partial<PropertyOptions>): (target: Component, key: string) => void;

/**
 * `@property` decorator. Inspired by the VueJS compiler, this decorator replaces explicitly assigned properties
 * with getters/setters that delegate down to the state container.
 *
 * `@property` can be invoked with additional options for enhanced functionality.
 *
 * ```
 * class DesignSystem extends Component {
 *   @property({key: 'value'}) foo = 'bar';
 * }
 * ```
 */
export function property (targetOrOptions: Partial<PropertyOptions> | Component, maybeKey?: string) {
  if (maybeKey) {
    return actualProperty(targetOrOptions as Component, maybeKey);
  }

  return (target: Component, key: string) => actualProperty(target, key, targetOrOptions as Partial<PropertyOptions>);
}
