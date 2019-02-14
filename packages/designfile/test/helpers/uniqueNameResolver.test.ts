import {UniqueNameResolver} from '../../src/helpers/uniqueNameResolver';

describe('UniqueNameResolver', () => {
  describe('#get', () => {

    test('provides different names every time is invoked', () => {
      const resolver = new UniqueNameResolver();
      const name = resolver.get('myFile');
      const name1 = resolver.get('myFile');
      const name2 = resolver.get('myFile');

      expect(name).not.toEqual(name1);
      expect(name).not.toEqual(name2);
      expect(name1).not.toEqual(name2);
    });

    test('adds a numeric suffix when asked to resolve the same name', () => {
      const resolver = new UniqueNameResolver();
      const name = resolver.get('myFile');
      const name1 = resolver.get('myFile');
      const name2 = resolver.get('myFile');

      expect(name).toEqual(name);
      expect(name1).toEqual('myFile Copy 1');
      expect(name2).toEqual('myFile Copy 2');
    });
  });
});
