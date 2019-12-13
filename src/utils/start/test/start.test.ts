import {assignMock, cleanupMockCommandData, diezRun, mockCanRunCommand, mockCliCoreFactory} from '@diez/test-utils';
const cliCore = mockCliCoreFactory();
jest.doMock('@diez/cli-core', () => cliCore);

const mockFork = jest.fn();
const mockSpawn = jest.fn();
const mockExecSync = jest.fn();
jest.doMock('child_process', () => {
  const childProcess = jest.requireActual('child_process');
  childProcess.fork = mockFork;
  childProcess.spawn = mockSpawn;
  childProcess.execSync = mockExecSync;
  return childProcess;
});

import * as child_process from 'child_process';
import {EventEmitter} from 'events';

const mockProcess = new EventEmitter();

assignMock(process, 'exit');

beforeEach(() => {
  mockCanRunCommand.mockImplementation(() => true);
  mockFork.mockReset();
  mockFork.mockReturnValue(mockProcess);
  mockSpawn.mockReset();
  mockExecSync.mockReset();
  mockExecSync.mockReturnValue('');
  cliCore.packageManager.exec.mockClear();
});

afterEach(() => {
  cleanupMockCommandData();
});

describe('diez start command', () => {
  test('crashes if no arguments', async () => {
    await diezRun('start');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('kills app process if start exits', async () => {
    await diezRun('start web');
    const appProcess = {
      killed: false,
      kill () {
        Object.assign(this, {killed: true});
      },
    } as child_process.ChildProcess;

    jest.spyOn(cliCore.packageManager, 'exec').mockReturnValue({task: appProcess});
    expect(child_process.fork).toHaveBeenNthCalledWith(
      1, expect.stringContaining('diez/bin/diez'), ['hot', '-t', 'web'], expect.anything());

    mockProcess.emit('message', 'built');
    mockProcess.emit('exit');
    expect(appProcess.killed).toBe(true);
  });

  test('Android golden path', async () => {
    await diezRun('start android');
    mockProcess.emit('message', 'built');
    expect(cliCore.packageManager.exec).toHaveBeenNthCalledWith(
      1, expect.arrayContaining(['diez', 'compile', '-t', 'android']), expect.anything());
    expect(mockFork).toHaveBeenCalledWith(
      expect.stringContaining('diez/bin/diez'), ['hot', '-t', 'android'], expect.anything());
  });

  test('iOS - no CocoaPods', async () => {
    mockCanRunCommand.mockImplementation((command) => command === 'pod --version' ? false : true);
    await diezRun('start ios');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('iOS - bad CocoaPods', async () => {
    mockExecSync.mockReturnValue('1.6.9');
    await diezRun('start ios');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('iOS golden path', async () => {
    mockExecSync.mockReturnValue('1.7.0');
    await diezRun('start ios');
    mockProcess.emit('message', 'built');
    expect(mockExecSync).toHaveBeenNthCalledWith(1, 'pod --version');
    expect(cliCore.packageManager.exec).toHaveBeenCalledWith(
      expect.arrayContaining(['diez', 'compile', '-t', 'ios', '--cocoapods']), expect.anything());
    expect(mockExecSync).toHaveBeenLastCalledWith('pod install', expect.anything());
    expect(mockFork).toHaveBeenCalledWith(
      expect.stringContaining('diez/bin/diez'), ['hot', '-t', 'ios'], expect.anything());
  });

  test('Web golden path', async () => {
    await diezRun('start web');
    mockProcess.emit('message', 'built');
    expect(cliCore.packageManager.exec).toHaveBeenNthCalledWith(
      1, expect.arrayContaining(['diez', 'compile', '-t', 'web']), expect.anything());
    expect(mockFork).toHaveBeenCalledWith(
      expect.stringContaining('diez/bin/diez'), ['hot', '-t', 'web'], expect.anything());
  });
});
