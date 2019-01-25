export const shared = (target: any, key: string) => {
  Object.defineProperty(target, key, {
    get () {
      // Yield the value from our host if it is provided.
      if (this.host && this.host[key]) {
        return this.host[key];
      }

      // Check a shared binding for a suitable default.
      if (this.boundShared && this.boundShared[key]) {
        return this.boundShares[key];
      }

      // Allow potential errors to fall through with a null return.
      return null;
    },
    set (data) {
      // Track bound states so we know if (on _this_ instance) a state has already been
      // initialized.
      if (!this.boundShared) {
        this.boundShared = new Map<string, boolean>();
      }

      this.boundShared[key] = data;
    },
  });
};

/**
 * `@property` decorator. Inspired by VueJS, this decorator replaces explicitly assigned properties
 * with getters/setters that delegate down to the state container.
 */
export const property = (target: any, key: string) => {
  Object.defineProperty(target, key, {
    get () {
      return this.state[key];
    },

    set (data) {
      // Track bound states so we know if (on _this_ instance) a state has already been
      // initialized.
      if (!this.boundStates) {
        this.boundStates = new Map<string, boolean>();
      }

      // Important: only set the state if it is undefined at bind-time or has already been bound.
      // In the event that it is not undefined and unbound, it must have been overridden with a
      // construction-time value.
      if (this.state[key] === undefined || this.boundStates[key]) {
        this.set({[key]: data});
      }

      this.boundStates[key] = true;

      // Important: if we detect that a data value is actually an expression, make sure it knows
      // to auto-resolve state names against itself unless otherwise specified.
      if (data && typeof data === 'object' && data.constructor.isExpression) {
        data.autoResolve(this);
      }
    },
  });
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
