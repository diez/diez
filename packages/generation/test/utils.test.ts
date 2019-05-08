import {UniqueNameResolver} from '../src/utils';

describe('UniqueNameResolver', () => {
  test('provides conventional asset names', () => {
    const resolver = new UniqueNameResolver();
    const name = resolver.getAssetName('File Name');
    const name1 = resolver.getAssetName('File Name');
    const name2 = resolver.getAssetName('File Name');
    const name3 = resolver.getAssetName('Other File Name');

    expect(name).toBe('File Name');
    expect(name1).toBe('File Name Copy 1');
    expect(name2).toBe('File Name Copy 2');
    expect(name3).toBe('Other File Name');
  });

  test('provides conventional component names', () => {
    const resolver = new UniqueNameResolver();
    const name = resolver.getComponentName('my design_system');
    const name1 = resolver.getComponentName('my design_system');
    const name2 = resolver.getComponentName('some-other-design-system');

    expect(name).toBe('MyDesignSystem');
    expect(name1).toBe('MyDesignSystem1');
    expect(name2).toBe('SomeOtherDesignSystem');
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
