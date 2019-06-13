import {mockCliCoreFactory, mockExitTrap, mockSocketTrap} from '@diez/test-utils';
import {EventEmitter} from 'events';

beforeAll(() => {
  // Allow 1 minute per test.
  jest.setTimeout(6e4);
});

jest.doMock('@diez/cli-core', mockCliCoreFactory);

const mockHotPublish = jest.fn();
jest.doMock('webpack-hot-middleware', () => () => ({
  publish: mockHotPublish,
}));

const mockWatcher = new EventEmitter();
jest.doMock('chokidar', () => ({watch: () => mockWatcher}));

let webpackCloser: () => void;
jest.doMock('webpack-dev-middleware', () => (...args: any[]) => {
  webpackCloser = jest.requireActual('webpack-dev-middleware')(...args).close;
});

const mockExpressRender = jest.fn();
jest.doMock('express', () => {
  jest.genMockFromModule('express');
  const app = {
    set: () => {},
    get: (_: string, callback: (request: any, response: any) => void) => {
      callback({params: {componentName: 'foobar'}}, {render: mockExpressRender});
    },
    use: () => {},
    engine: () => {},
    listen: (port: number, callback: () => void) => callback(),
  };

  const factory = () => app;
  factory.static = () => {};
  return factory;
});

class MockSocket extends EventEmitter {
  setEncoding () {}

}

const mockSocket = new MockSocket();
const mockCreateConnection = jest.fn().mockImplementation(
  (port: number, host: string, callback: () => void) => {
    callback();
    return mockSocket;
  });
jest.doMock('net', () => ({
  createConnection: mockCreateConnection,
}));

import {ensureDirSync, removeSync, writeFileSync} from 'fs-extra';
import {join} from 'path';
import {CompilerEvent} from '../src/api';
import {createProgramForFixture, stubProjectRoot, TestTargetCompiler} from './helpers';

jest.mock('debounce', () => (callback: () => void) => callback);

beforeEach(() => {
  const diezRoot = join(stubProjectRoot, '.diez');
  removeSync(diezRoot);
  ensureDirSync(diezRoot);
  writeFileSync(join(diezRoot, 'extract-port'), '9001');
});

describe('hot server', () => {
  test('hot e2e', async () => {
    // This test actually starts a hot TypeScript server, ensuring the steps we take to start the hot server are safe.
    const program = await createProgramForFixture('Filtered', true);

    return new Promise((resolve) => {
      program.once(CompilerEvent.Compiled, async () => {
        const compiler = new TestTargetCompiler(program);
        await compiler.start();
        expect(mockExitTrap).toHaveBeenCalled();
        expect(mockExpressRender).toHaveBeenCalledWith('component', {componentName: 'foobar', layout: false});

        // Simulate attaching to an asset server.
        mockWatcher.emit('add');
        expect(mockCreateConnection).toHaveBeenCalledWith(9001, '0.0.0.0', expect.anything());
        expect(mockSocketTrap).toHaveBeenCalledWith(mockSocket);

        // Simulate asset server reload signal.
        mockSocket.emit('data', JSON.stringify({event: 'reload'}));

        // Wait for next failure.
        program.once(CompilerEvent.Error, () => {
          // Wait for next success.
          program.once(CompilerEvent.Compiled, () => {
            program.close();
            webpackCloser();
            resolve();
          });

          // Write valid TypeScript to the project root.
          writeFileSync(
            join(program.projectRoot, 'src', 'index.ts'),
            'const diez = 10;',
          );
        });

        // Write invalid TypeScript to the project root.
        writeFileSync(
          join(program.projectRoot, 'src', 'index.ts'),
          'const diez = √100;',
        );
      });

      program.watch();
    });
  });
});
