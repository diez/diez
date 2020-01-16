import {findPlugins} from '@diez/cli-core';
import {Target} from '@diez/engine';
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

jest.doMock('fs-extra', () => {
  return {
    readFile: readFileMock,
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

import {ExistingHotUrlMutexError, getAssemblerFactory, getProjectRoot, getTargets, showStackTracesFromRuntimeError} from '../src/utils';

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
});
