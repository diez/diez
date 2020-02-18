import {Serializable, Presentable} from '../src/api';
import {serialize, presentProperties} from '../src/serialization';

class FooString implements Serializable<string> {
  constructor (private readonly input: string) {}

  serialize () {
    return `foo${this.input}`;
  }
}

class BarString extends FooString implements Presentable<string> {
  toPresentableValue () {
    return 'presented bar'
  }
}

describe('serialization', () => {
  test('payload', () => {
    const values = {
      justbar: 'bar',
      foobar: [new FooString('bar')],
    };

    expect(serialize(values)).toEqual({
      justbar: 'bar',
      foobar: ['foobar'],
    });
  });
});

describe('toPresentableValue', () => {
  test('payload', () => {
    const values = {
      justbar: 'bar',
      foo: [new FooString('foo')],
      bar: new BarString('bar'),
    };

    expect(presentProperties(values)).toEqual({
      justbar: 'bar',
      foo: '[]',
      bar: 'presented bar'
    });
  });
});
