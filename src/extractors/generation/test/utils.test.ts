import {UniqueNameResolver} from '../src/utils';

describe('UniqueNameResolver', () => {
  test('provides conventional component names', () => {
    const resolver = new UniqueNameResolver();
    const name = resolver.getComponentName('my design_language');
    const name1 = resolver.getComponentName('my design_language');
    const name2 = resolver.getComponentName('some-other-design-language');

    expect(name).toBe('MyDesignLanguage');
    expect(name1).toBe('MyDesignLanguage1');
    expect(name2).toBe('SomeOtherDesignLanguage');
  });

  test('provides conventional property names', () => {
    const resolver = new UniqueNameResolver();
    const name = resolver.getPropertyName('foo bar', 'Baz');
    const name1 = resolver.getPropertyName('foo bar', 'Baz');
    const name2 = resolver.getPropertyName('foo bar', 'Bat');

    expect(name).toBe('fooBar');
    expect(name1).toBe('fooBar1');
    expect(name2).toBe('fooBar');
  });
});
