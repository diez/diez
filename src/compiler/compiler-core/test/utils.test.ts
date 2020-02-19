import {findPlugins} from '@diez/cli-core';
import {Target, Serializable} from '@diez/engine';
import {
  mockCliCoreFactory,
  mockLogCode,
  mockLogError,
} from '@diez/test-utils';
import {join} from 'path';
jest.doMock('@diez/cli-core', mockCliCoreFactory);
const readFileMock = jest.fn((file: string) => {
  return Promise.resolve({
    toString () {
      return `
// this is a fake design language file
export const designLanguage = {
  myColor: colors.color;
}
      `;
    },
  });
});

const registerHelperMock = jest.fn();
const registerPartialMock = jest.fn();
jest.doMock('handlebars', () => {
  return {
    ...jest.requireActual('handlebars'),
    registerHelper: registerHelperMock,
    registerPartial: registerPartialMock,
  }
});

jest.doMock('fs-extra', () => {
  return {
    readFile: readFileMock,
    readFileSync: jest.fn(() => ({})),
  };
});

class SourceMapConsumerMock {
  originalPositionFor = jest.fn(() => {
    return {
      source: '../src/DesignLanguage.ts',
      line: '3',
      column: '6',
    };
  });
}

const sourceMapConsumerMock = new SourceMapConsumerMock();

jest.doMock('source-map', () => {
  return {
    SourceMapConsumer: class MockClass {
      constructor () {
        return sourceMapConsumerMock;
      }
    },
  };
});

import {ExistingHotUrlMutexError, getAssemblerFactory, getProjectRoot, getTargets, showStackTracesFromRuntimeError, indentContentHelper, propertyIsCommentableHelper, setUpHandlebars, presentProperties} from '../src/utils';
import {Presentable} from '../src/api';

beforeEach(() => {
  mockLogError.mockReset();
});

describe('utils', () => {
  test('target discovery', async () => {
    const plugins = await findPlugins();
    plugins.set('.', {
      providers: {
        targets: [
          './test/target',
        ],
      },
    });
    const targets = await getTargets();
    expect(targets.has('test' as Target)).toBe(true);
  });

  test('project root detection', async () => {
    expect(await getProjectRoot()).toBe(global.process.cwd());
    const plugins = await findPlugins();
    plugins.set('.', {
      projectRoot: './foobar',
    });
    expect(await getProjectRoot()).toBe(join(global.process.cwd(), 'foobar'));
  });

  test('assembler factory', async () => {
    expect(getAssemblerFactory(Target.Android)).rejects.toThrow();

    const plugins = await findPlugins();
    plugins.set('.', {
      providers: {
        assemblers: {
          [Target.Android]: './test/assembler',
        },
      },
    });

    expect(await getAssemblerFactory(Target.Android)).toBe(require('./assembler'));
  });

  test('ExistingHotUrlMutexError', () => {
    const error = new ExistingHotUrlMutexError('Hot error', 'mutex/path');
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Hot error');
    expect(error.mutexPath).toBe('mutex/path');
  });

  describe('#showStackTracesFromRuntimeError', () => {
    test('shows only the error message if cant get a stack trace', async () => {
      const error = new Error('TestError: test message error');
      error.stack = undefined;
      await showStackTracesFromRuntimeError(error);
      expect(mockLogError).toHaveBeenCalledWith('TestError: test message error');
    });

    test('shows error.toString if we cant get info from it', async () => {
      const error = new Error('TestError: test message error');
      error.stack = 'maybe garbled stack trace';
      await showStackTracesFromRuntimeError(error);
      expect(mockLogError).toHaveBeenCalledWith(error.toString());

      error.stack = 'maybe garbled stack trace \n more garbage';
      await showStackTracesFromRuntimeError(error);
      expect(mockLogError).toHaveBeenNthCalledWith(2, error.toString());

      error.stack = 'maybe garbled stack trace \n (more garbage)';
      await showStackTracesFromRuntimeError(error);
      expect(mockLogError).toHaveBeenNthCalledWith(3, error.toString());

      error.stack = 'maybe garbled stack trace \n (path/to/file.js:22)';
      await showStackTracesFromRuntimeError(error);
      expect(mockLogError).toHaveBeenNthCalledWith(4, error.toString());
    });

    test('shows useful information when we have a valid stack trace available', async () => {
      const error = new Error('TestError: test message error');
      error.stack = `TypeError: Cannot read property 'teste' of undefined
at Object.<anonymous> (/Users/roperzh/projects/haiku/diez-mono/diez/examples/lorem-ipsum/design-language/lib/DesignLanguage.js:2:5)
at Module._compile (internal/modules/cjs/loader.js:778:30)
      `;

      await showStackTracesFromRuntimeError(error);
      expect(mockLogError).toHaveBeenNthCalledWith(1, error.message);
      expect(mockLogError).toHaveBeenNthCalledWith(2, '    at /Users/roperzh/projects/haiku/diez-mono/diez/examples/lorem-ipsum/design-language/src/DesignLanguage.ts:3:6');
      expect(mockLogCode).toHaveBeenNthCalledWith(1, 'export const designLanguage = {\n     ^');
    });
  });

  describe('Handlebars helpers', () => {
    describe('#indentContentHelper', () => {
      it('adds even indentation to multiline strings', () => {
        expect(indentContentHelper('this\n is a \n multiline string.')).toBe('  this\n   is a \n   multiline string.');
      });

      it('allows to set custom indentation values', () => {
        expect(indentContentHelper('this\n is a \n multiline string.', ' * ')).toBe(' * this\n *  is a \n *  multiline string.');
      });

      it('allows to set custom multiline delimiters', () => {
        expect(indentContentHelper('this | is a  | multiline string.', ' * ', '|')).toBe(' * this \n *  is a  \n *  multiline string.');
      });
    });

    describe('#propertyIsCommentableHelper', () => {
      const options = {
        fn: jest.fn(),
        inverse: jest.fn(),
      }

      beforeEach(() => {
        options.fn.mockReset();
        options.inverse.mockReset();
      });

      it('uses the inverse clause if the property is not commentable', () => {
        propertyIsCommentableHelper({}, options);
        expect(options.inverse).toBeCalled();
        expect(options.fn).not.toBeCalled();

        propertyIsCommentableHelper({description: {}, presentation: {properties: null}}, options);
        expect(options.inverse).toBeCalled();
        expect(options.fn).not.toBeCalled();
      });

      it('uses the fn clause if the property is commentable', () => {
        propertyIsCommentableHelper({description: {body: 'not empty!'}, presentation: {properties: null}}, options);
        expect(options.fn).toBeCalled();
        expect(options.inverse).not.toBeCalled();

        propertyIsCommentableHelper({description: {body: null}, presentation: {properties: [{}]}}, options);
        expect(options.fn).toBeCalled();
        expect(options.inverse).not.toBeCalled();
      });
    });

    describe('#setUpHandlebars', () => {
      it('registers helpers and partials', () => {
        setUpHandlebars();
        expect(registerHelperMock).toBeCalled();
        expect(registerPartialMock).toBeCalled();
      });
    });
  });

  describe('#presentProperties', () => {
    test('payload', () => {

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

});
