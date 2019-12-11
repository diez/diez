import {cleanupMockOsData, mockOsData, mockOsFactory} from '@diez/test-utils';
jest.doMock('os', mockOsFactory);

const mockExec = jest.fn();
jest.doMock('child_process', () => ({
  ...jest.requireActual('child_process'),
  exec: mockExec,
}));

import {ChildProcess} from 'child_process';
import {join} from 'path';
import {canRunCommand, execAsync, exitTrap, findPlugins, isChildProcess, isMacOS, locateBinaryMacOS, isWindows} from '../src/utils';

beforeEach(() => {
  cleanupMockOsData();
  mockExec.mockReset();
});

describe('utils', () => {
  test('findPlugins', async () => {
    const plugins = await findPlugins(join(__dirname, 'fixtures', 'starting-point'));
    expect(plugins.has('command-provider')).toBe(true);
  });

  test('execAsync', async () => {
    mockExec.mockImplementationOnce((command: any, options: any, callback: Function) => {
      callback(new Error('whoops'));
    });
    expect(execAsync('hello')).rejects.toThrow();
    mockExec.mockImplementationOnce((command: any, options: any, callback: Function) => {
      callback(null, '');
    });
    expect(execAsync('hello')).rejects.not.toThrow();
  });

  test('canRunCommand', async () => {
    mockExec.mockImplementationOnce((command: any, options: any, callback: Function) => {
      // Error response should count as "no".
      callback(new Error('whoops'));
    });
    expect(await canRunCommand('hello')).toBe(false);

    mockExec.mockImplementationOnce((command: any, options: any, callback: Function) => {
      // Empty stdout should also count as "no".
      callback(null, '');
    });
    expect(await canRunCommand('hello')).toBe(false);

    mockExec.mockImplementationOnce((command: any, options: any, callback: Function) => {
      callback(null, 'hello!');
    });
    expect(await canRunCommand('hello')).toBe(true);
  });

  test('isMacOS', async () => {
    expect(isMacOS()).toBe(false);
    mockOsData.platform = 'darwin';
    expect(isMacOS()).toBe(true);
  });

  test('isWindows', async () => {
    expect(isWindows()).toBe(false);
    mockOsData.platform = 'win32';
    expect(isWindows()).toBe(true);
  });

  test('locateBinaryMacOS', async () => {
    // This method is only allowed on macOS.
    expect(locateBinaryMacOS('com.foo.bar')).rejects.toThrow();
    mockOsData.platform = 'darwin';

    mockExec.mockImplementationOnce((command: any, options: any, callback: Function) => {
      callback(null, '');
    });
    expect(await locateBinaryMacOS('com.foo.bar')).toBeUndefined();

    mockExec.mockImplementationOnce((command: any, options: any, callback: Function) => {
      callback(null, '/path/to/first/match\n/path/to/second/match');
    });
    expect(await locateBinaryMacOS('com.foo.bar')).toBe('/path/to/first/match');
    expect(mockExec.mock.calls[0][0]).toBe('mdfind kMDItemCFBundleIdentifier=com.foo.bar');
  });

  test('exitTrap', () => {
    const mock = jest.fn();
    exitTrap(mock);
    process.emit('exit', 0);
    process.emit('SIGINT', 'SIGINT');
    process.emit('SIGHUP', 'SIGHUP');
    process.emit('SIGQUIT', 'SIGQUIT');
    process.emit('SIGTSTP', 'SIGTSTP');
    expect(mock).toHaveBeenCalledTimes(5);
  });

  test('isChildProcess', () => {
    expect(isChildProcess(new Buffer(''))).toBe(false);
    expect(isChildProcess(void(0))).toBe(false);
    expect(isChildProcess({kill: () => {}} as ChildProcess)).toBe(true);
  });
});
