import {Serializable} from '../src/api';
import {Serializer} from '../src/serialization';

class FooString implements Serializable {
  constructor (private readonly input: string) {}

  serialize () {
    return `foo${this.input}`;
  }
}

describe('serialization', () => {
  test('payload', () => {
    interface SerializableState {
      justbar: string;
      foobar: FooString[];
    }

    const state: SerializableState = {
      justbar: 'bar',
      foobar: [new FooString('bar')],
    };

    const serializer = new Serializer<SerializableState>(state);
    expect(serializer.payload).toEqual({
      justbar: 'bar',
      foobar: ['foobar'],
    });
  });
});
