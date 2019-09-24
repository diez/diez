import {prefab} from '../src/prefab';

interface FooStringData {
  value: string;
}

class FooString extends prefab<FooStringData>() {
  defaults = {
    value: '',
  };

  sanitize ({value}: FooStringData) {
    return {value: `foo${value}`};
  }
}

interface FooData {
  justbar: string[];
  foobar: FooString;
}

class FooPrefab extends prefab<FooData>() {
  defaults = {
    justbar: ['bar'],
    foobar: new FooString(),
  };
}

describe('prefab', () => {
  test('serializes through sanitized inputs and nested subcomponents', () => {
    const plain = new FooPrefab();
    expect(plain.serialize()).toEqual({
      justbar: ['bar'],
      foobar: {value: 'foo'},
    });

    const someFooString = new FooString({value: 'bar'});
    const overridden = new FooPrefab({
      justbar: ['bar', 'bar'],
      foobar: someFooString,
    });
    expect(overridden.serialize()).toEqual({
      justbar: ['bar', 'bar'],
      foobar: {value: 'foobar'},
    });

    // Confirm that we can access component data like regular properties.
    expect(overridden.foobar).toBe(someFooString);
  });
});
