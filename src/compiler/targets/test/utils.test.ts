import {Index} from 'lunr';
import {joinToKebabCase, webComponentListHelper} from '../src/utils';
import {applyCase, Case, joinToCase} from '../src/utils/casing';
import {handlebars, highlight, markdown} from '../src/utils/format';
import {buildIndex} from '../src/utils/search';
// tslint:disable-next-line:no-var-requires
const tree = require('./goldens/Primitives/diez-target-test-stub-docs/tree.json');

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
      references: [],
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
      references: [],
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
      references: [],
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
      references: [],
    })).toBe('this.foo = foo.map((value1) => value1.map((value2) => value2.map((value3) => new Foo(value3))));');
  });
});

describe('utils/casing', () => {
  describe('applyCase', () => {
    test('applies the correct casing to the provided value', () => {
      expect(applyCase('my-string', Case.Camel)).toBe('myString');
      expect(applyCase('my-string', Case.Snake)).toBe('my_string');
      expect(applyCase('my-string')).toBe('myString');
    });
  });

  describe('joinToCase', () => {
    test('joins arrays of strings by case with the provided separator', () => {
      const path = ['JavaScript', 'ruby', 'python_dash'];
      expect(joinToCase(path, Case.Pascal)).toBe('JavaScript.Ruby.PythonDash');
      expect(joinToCase(path)).toBe('javaScript.ruby.pythonDash');
      expect(joinToCase(path, Case.Pascal, '.', 'get', '()')).toBe('getJavaScript().getRuby().getPythonDash()');
    });
  });
});

describe('utils/search', () => {
  describe('buildIndex', () => {
    const index = buildIndex(tree);

    test('returns a valid search index', () => {
      expect(index).toBeDefined();
      expect(index).toBeInstanceOf(Index);
    });

    test('includes nested values', () => {
      expect(index.search('primitives')[0]).toBeDefined();
    });
  });
});

describe('utils/format', () => {
  describe('markdown', () => {
    test('applies the correct casing to the provided value', () => {
      expect(markdown('**markdown**')).toBe('<p><strong>markdown</strong></p>\n');
    });
  });

  describe('highlight', () => {
    test('applies the correct casing to the provided value', () => {
      expect(highlight('const test = ""', 'js')).toBe('<span class=\"token keyword\">const</span> test <span class=\"token operator\">=</span> <span class=\"token string\">\"\"</span>');
    });
  });

  describe('handlebars', () => {
    test('handles basic template functionality', () => {
      expect(handlebars('raw template')).toBe('raw template');
      expect(handlebars('{{#if false}}nothing{{else}}something{{/if}}')).toBe('something');
    });

    test('accepts custom data to be passed', () => {
      expect(handlebars('{{one}}', {one: 'uno'})).toBe('uno');
    });

    test('accepts custom helpers to be passed', () => {
      expect(handlebars('{{one}}', {}, {helpers: {one: () => {
        return 'uno';
      }}})).toBe('uno');
    });
  });
});
