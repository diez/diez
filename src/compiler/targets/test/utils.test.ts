import {joinToKebabCase, webComponentListHelper} from '../src/utils';

describe('joinToKebabCase', () => {
  test('joins all arguments using kebab-case', () => {
    expect(joinToKebabCase('MyVar')).toBe('my-var');
    expect(joinToKebabCase('Parent', 'Child')).toBe('parent-child');
    expect(joinToKebabCase('Parent', 2, 'Child')).toBe('parent-2-child');
    expect(joinToKebabCase()).toBe('');
  });
});

describe('webComponentListHelper', () => {
  test('throws on non-lists', () => {
    expect(() => webComponentListHelper('foo', {
      type: 'Foo',
      depth: 0,
      isPrimitive: false,
      initializer: '{bar: "baz"}',
    })).toThrow();
  });

  test('throws on non-components', () => {
    expect(() => webComponentListHelper('foo', {
      type: 'string',
      depth: 10,
      isPrimitive: true,
      initializer: '[[[[[[[[[["10"]]]]]]]]]]',
    })).toThrow();
  });

  test('produces expected output for depth = 1', () => {
    expect(webComponentListHelper('foo', {
      type: 'Foo',
      depth: 1,
      isPrimitive: false,
      initializer: '',
    })).toBe('this.foo = foo.map((value1) => new Foo(value1));');
  });

  test('produces expected output for depth = 3', () => {
    expect(webComponentListHelper('foo', {
      type: 'Foo',
      depth: 3,
      isPrimitive: false,
      initializer: '',
    })).toBe('this.foo = foo.map((value1) => value1.map((value2) => value2.map((value3) => new Foo(value3))));');
  });
});
