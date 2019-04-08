import {Component} from './component';

/**
 * `@shared` decorator. Enables one-way data binding from a host component to its children, suitable for use in
 * expressions.
 */
export const shared = (target: Component, key: string) => {
  Object.defineProperty(target, key, {
    get () {
      // Yield the value from our host if it is provided.
      if (this.host && this.host.get(key)) {
        return this.host.get(key);
      }

      // Check a shared binding for a suitable default.
      if (this.boundShared.get(key)) {
        return this.boundShared.get(key);
      }

      // Allow potential errors to fall through with a null return.
      return null;
    },
    set (data: any) {
      this.boundShared.set(key, data);
    },
  } as ThisType<Component>);
};

/**
 * `@property` decorator. Inspired by VueJS, this decorator replaces explicitly assigned properties
 * with getters/setters that delegate down to the state container.
 */
export const property = (target: Component, key: string) => {
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

      this.boundStates.set(key, true);

      // Important: if we detect that a data value is actually an expression, make sure it knows
      // to auto-resolve state names against itself unless otherwise specified.
      if (data && typeof data === 'object' && data.constructor.isExpression) {
        data.autoResolve(this);
      }
    },
  } as ThisType<Component>);
};

/**
 * `@method` decorator. Late-binds methods to a class prototype by name key.
 */
export const method = (target: any, key: string, descriptor: any) => {
  if (!target.listeners) {
    target.listeners = {};
  }
  target.listeners[key] = descriptor.value;
};
