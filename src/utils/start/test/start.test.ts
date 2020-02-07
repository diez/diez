import {assignMock, cleanupMockCommandData, diezRun, mockCanRunCommand, mockCliCoreFactory, mockPackageManagerInstance} from '@diez/test-utils';
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

import {EventEmitter} from 'events';

const mockProcess = new EventEmitter();

assignMock(process, 'exit');

beforeEach(() => {
  mockCanRunCommand.mockImplementation(() => true);
  mockFork.mockReset();
  mockFork.mockReturnValue(mockProcess);
  mockSpawn.mockReset();
  mockExecSync.mockClear();
  mockPackageManagerInstance.exec.mockClear();
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
    const appProcess = {
      killed: false,
      kill () {
        Object.assign(this, {killed: true});
      },
    };

    mockSpawn.mockReturnValueOnce(appProcess);

    await diezRun('start web');
    expect(mockFork).toHaveBeenNthCalledWith(
      1, expect.stringContaining('diez/bin/diez'), ['hot', '-t', 'web'], expect.anything());

    mockProcess.emit('message', 'built');
    mockProcess.emit('exit');
    expect(appProcess.killed).toBe(true);
    expect(process.exit).toHaveBeenCalled();
  });

  test('Android golden path', async () => {
    await diezRun('start android');
    mockProcess.emit('message', 'built');
    expect(mockPackageManagerInstance.execBinary).toHaveBeenLastCalledWith(
      expect.stringContaining('diez compile -t android'), expect.anything());
    expect(mockFork).toHaveBeenCalledWith(
      expect.stringContaining('diez/bin/diez'), ['hot', '-t', 'android'], expect.anything());
  });

  test('iOS - no CocoaPods', async () => {
    mockCanRunCommand.mockImplementation((command) => command === 'pod --version' ? false : true);
    await diezRun('start ios');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('iOS - bad CocoaPods', async () => {
    mockExecSync.mockReturnValueOnce('1.6.9');
    await diezRun('start ios');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('iOS golden path', async () => {
    mockExecSync.mockReturnValueOnce('1.7.0');
    await diezRun('start ios');
    mockProcess.emit('message', 'built');
    expect(mockExecSync).toHaveBeenNthCalledWith(1, 'pod --version');
    expect(mockPackageManagerInstance.execBinary).toHaveBeenLastCalledWith(
      expect.stringContaining('diez compile -t ios --cocoapods'), expect.anything());
    expect(mockExecSync).toHaveBeenLastCalledWith('pod install', expect.anything());
    expect(mockFork).toHaveBeenCalledWith(
      expect.stringContaining('diez/bin/diez'), ['hot', '-t', 'ios'], expect.anything());
  });

  test('Web golden path', async () => {
    await diezRun('start web');
    mockProcess.emit('message', 'built');
    expect(mockPackageManagerInstance.execBinary).toHaveBeenLastCalledWith(
      expect.stringContaining('diez compile -t web'), expect.anything());
    expect(mockFork).toHaveBeenCalledWith(
      expect.stringContaining('diez/bin/diez'), ['hot', '-t', 'web'], expect.anything());
  });
});
