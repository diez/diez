import {AnySerializable, ExpressionResolver, Formula, Serializable} from './api';

/**
 * Given a function specification, retrieve its args for inspection.
 */
const getArgs = (formula: Formula<any>): string[] => {
  return formula
    .toString()
    .match(/\(([^)]*)\)/)![1]
    .split(',')
    .map((arg) => arg.replace(/\/\*.*\*\//, '').trim())
    .filter((arg) => !!arg);
};

/**
 * An internal class that is always proxied to its return value.
 */
class Expression<T extends AnySerializable> implements Serializable {
  private readonly argList: string[];
  private resolver: ExpressionResolver = {};

  /**
   * Important: this flag instructs the `@property` decorator we are dealing with an expression
   * instance.
   */
  static isExpression = true;

  constructor (
    private readonly formula: Formula<T>,
  ) {
    // TODO: support a compile-time alternative passing in explicit prop names as strings, and prefer
    // this when it is provided, in the manner of `ngInject`.
    this.argList = getArgs(formula);
  }

  /**
   * Binds a default resolver for `this.argList`.
   * {@see {@link decorators.ts}}
   */
  autoResolve (resolver: ExpressionResolver) {
    this.resolver = resolver;
  }

  /**
   * Serializable interface.
   *
   * By implementing formula evaluation here, we can cleanly sub our proxied instance in at patch
   * time and receive back the expected serialized payload.
   */
  serialize (): T {
    // TODO: implement dirty arg watching (only update expression if one of its args has changed).
    const serialized = this.formula.apply(
      this.resolver,
      this.argList.map(
        (name: string) => this.resolver[name] || null,
      ),
    );

    return serialized;
  }
}

/**
 * Generic expression constructor that hides the Expression<T> type in a `Proxy` designed to unwrap
 * to the "derived" `T` instance for typing purposes.
 *
 * See `component.test.ts` for examples.
 */
export const expression = <T extends AnySerializable>(
  formula: Formula<T>,
): T => {
  const instance = new Expression<T>(formula);
  return new Proxy(
    instance,
    {
      get (self: any, property: string) {
        const serialized = self.serialize();
        if (property === 'serialize' && serialized.serialize) {
          return serialized.serialize;
        }

        // If this property is defined on ourself (think `serialize` or `autoResolve`), return it
        // directly.
        if (
          // Nit: Object.prototype provides `toString()`, but we don't really want it here.
          property !== 'toString' &&
          (self[property] || self[property] === null || !self.serialize)
        ) {
          return self[property];
        }

        const proxied = serialized[property];
        if (proxied instanceof Function) {
          // Important: make sure to bind to our serialized self if we have a proxied function.
          // Without this, method calls on expression-wrapped components and primitives won't work.
          return proxied.bind(serialized);
        }

        return proxied;
      },
    });
};
