import {Component, expression, method, property, Serializable, shared} from '../src';

class FooString implements Serializable {
  constructor (private readonly input: string) {}

  serialize () {
    return `foo${this.input}`;
  }
}

interface FooState {
  justbar: string;
  foobar: FooString;
}

class FooComponent extends Component<FooState> {}

describe('component', () => {
  test('ticks on state changes', () => {
    const patcher = jest.fn();
    const component = new FooComponent(
      {
        justbar: '',
        foobar: new FooString('bar'),
      },
    );

    component.tick(0, patcher);
    expect(patcher).toBeCalledTimes(0);
    component.set({justbar: 'bar'});
    expect(patcher).toBeCalledTimes(0);
    component.tick(1, patcher);
    expect(patcher).toBeCalledTimes(1);
    expect(patcher).toHaveBeenNthCalledWith(1, {
      justbar: 'bar',
      foobar: 'foobar',
    });
  });

  test('serializes nested components', () => {
    interface FooStateWrapper {
      foo: Component<FooState>;
    }

    class FooWrapperComponent extends Component<FooStateWrapper> {}

    const component = new FooWrapperComponent({
      foo: new FooComponent({
        justbar: 'bar',
        foobar: new FooString('bar'),
      }),
    });
    expect(component.serialize()).toEqual({
      foo: {
        justbar: 'bar',
        foobar: 'foobar',
      },
    });
  });

  test('can provide defaults via state decorators', () => {
    class Foo extends Component<FooState> {
      @property justbar = 'barbar';

      @property foobar = new FooString('barbaz');
    }

    interface FooStateWrapper {
      foo: Foo;
    }

    class FooWrapper extends Component<FooStateWrapper> {
      @property foo = new Foo();
    }

    const component = new FooWrapper();

    expect(component.serialize()).toEqual({
      foo: {
        justbar: 'barbar',
        foobar: 'foobarbaz',
      },
    });
  });

  test('child components dirty parents', () => {
    class Foo extends Component<FooState> {
      @property foobar = new FooString('bar');
    }

    interface FooStateWrapper {
      foo: Foo;
    }

    class FooWrapper extends Component<FooStateWrapper> {
      @property foo = new Foo();
    }

    const patcher = jest.fn();
    const component = new FooWrapper({});
    component.dirty();
    component.tick(0, patcher);
    expect(patcher).toBeCalledTimes(1);
    expect(patcher).toHaveBeenNthCalledWith(1, {
      foo: {
        foobar: 'foobar',
      },
    });
    component.foo.set({justbar: 'bar'});
    component.tick(1, patcher);
    expect(patcher).toBeCalledTimes(2);
    expect(patcher).toHaveBeenNthCalledWith(2, {
      foo: {
        justbar: 'bar',
        foobar: 'foobar',
      },
    });
  });

  test('can provide global listeners via listener decorators', () => {
    const helloFn = jest.fn();
    class Foo extends Component<FooState> {
      @method hello (payload: string) {
        helloFn(payload);
      }
    }

    const component = new Foo();
    component.trigger<string>('hello', 'hello');

    expect(helloFn.mock.calls.length).toBe(1);
    expect(helloFn.mock.calls[0][0]).toBe('hello');
    component.trigger<string>('goodbye', 'noop');
    expect(helloFn.mock.calls.length).toBe(1);
    component.trigger<string>('hello', 'hello again!');
    expect(helloFn.mock.calls.length).toBe(2);
    expect(helloFn.mock.calls[1][0]).toBe('hello again!');
  });

  test('can provide expressions that proxy to their returned values', () => {
    interface DerivableState {
      f: string;
      fo: string;
      foo: string;
      foobar: string;
    }

    class Derivable extends Component<DerivableState> {
      @property f: string = 'f';

      @property fo: string = expression<string>((f: string) => `${f}o`);

      @property foo: string = expression<string>((fo: string) => `${fo}o`);

      @property foobar: string = expression<string>((foo: string) => `${foo}bar`);
    }

    const component = new Derivable();
    expect(component.serialize()).toEqual({
      f: 'f',
      fo: 'fo',
      foo: 'foo',
      foobar: 'foobar',
    });

    component.f += 'oobarf';
    expect(component.serialize()).toEqual({
      f: 'foobarf',
      fo: 'foobarfo',
      foo: 'foobarfoo',
      foobar: 'foobarfoobar',
    });

    // Note how we can use `component.foobar` like a string, even though it's an expression!
    expect(component.foobar.substr(0, 6)).toBe('foobar');
    expect(component.foobar.substr(0, 6).split('')).toEqual(['f', 'o', 'o', 'b', 'a', 'r']);
  });

  test('can use shared bindings to evaluate expressions from child components', () => {
    interface AdderState {
      sum: number;
    }

    class Adder extends Component<AdderState> {
      @shared a!: number;
      @shared b!: number;
      @shared c!: number;

      @property sum = expression<number>(
        (a: number, b: number, c: number) => a + b + c,
      );
    }

    interface MultiplierState {
      product: number;
    }

    class Multiplier extends Component<MultiplierState> {
      @shared a!: number;
      @shared b!: number;
      @shared c!: number;

      @property product = expression<number>(
        (a: number, b: number, c: number) => a * b * c,
      );
    }

    interface NumberBagState {
      a: number;
      b: number;
      c: number;

      adder: Adder;
      multiplier: Multiplier;
    }

    class NumberBag extends Component<NumberBagState> {
      @property a = 1;
      @property b = 3;
      @property c = 5;
      @property adder = new Adder();
      @property multiplier = new Multiplier();
    }

    const component = new NumberBag();
    expect(component.serialize()).toEqual({
      a: 1,
      b: 3,
      c: 5,
      adder: {
        sum: 9,
      },
      multiplier: {
        product: 15,
      },
    });

    component.a = 2;
    expect(component.serialize()).toEqual({
      a: 2,
      b: 3,
      c: 5,
      adder: {
        sum: 10,
      },
      multiplier: {
        product: 30,
      },
    });

    component.b *= 2;
    expect(component.serialize()).toEqual({
      a: 2,
      b: 6,
      c: 5,
      adder: {
        sum: 13,
      },
      multiplier: {
        product: 60,
      },
    });

    // Note how we can use `sum` like a number, even though it's an expression!
    expect(component.adder.sum.toFixed(3)).toBe('13.000');
  });
});
