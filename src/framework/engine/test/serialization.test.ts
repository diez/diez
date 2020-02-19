import {Serializable} from '../src/api';
import {serialize} from '../src/serialization';

class FooString implements Serializable<string> {
  constructor (private readonly input: string) {}

  serialize () {
    return `foo${this.input}`;
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
