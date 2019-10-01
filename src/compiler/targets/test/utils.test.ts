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
    expect(() => webComponentListHelper({
      type: 'Foo',
      depth: 0,
      isComponent: true,
      initializer: '{bar: "baz"}',
      name: 'foo',
      description: {body: ''},
    })).toThrow();
  });

  test('throws on non-components', () => {
    expect(() => webComponentListHelper({
      type: 'string',
      depth: 10,
      isComponent: false,
      initializer: '[[[[[[[[[["10"]]]]]]]]]]',
      name:'foo',
      description: {body: ''},
    })).toThrow();
  });

  test('produces expected output for depth = 1', () => {
    expect(webComponentListHelper({
      type: 'Foo',
      depth: 1,
      isComponent: true,
      initializer: '',
      name: 'foo',
      description: {body: ''},
    })).toBe('this.foo = foo.map((value1) => new Foo(value1));');
  });

  test('produces expected output for depth = 3', () => {
    expect(webComponentListHelper({
      type: 'Foo',
      depth: 3,
      isComponent: true,
      initializer: '',
      name: 'foo',
      description: {body: ''},
    })).toBe('this.foo = foo.map((value1) => value1.map((value2) => value2.map((value3) => new Foo(value3))));');
  });
});
