import {EventEmitter} from 'events';
const mockedSpawnSync = jest.fn();
const mockedSpawnTask = new EventEmitter();
const mockedSpawn = jest.fn(() => mockedSpawnTask);
const mockedExec = jest.fn((command: string, opts: any, callback: () => {}) => {
  callback();
});

jest.doMock('child_process', () => ({
  ...jest.requireActual('child_process'),
  spawnSync: mockedSpawnSync,
  spawn: mockedSpawn,
  exec: mockedExec,
}));

import {PackageManagers} from '../src';
import * as packageManager from '../src/package-manager';
import * as utils from '../src/utils';

describe('canUseNpm', () => {
  mockedSpawnSync.mockReturnValue({
    output: [
      null,
      Buffer.alloc(539, `
; cli configs
metrics-registry = "https://registry.npmjs.org/"
scope = ""
user-agent = "npm/6.4.1 node/v10.16.3 darwin x64"

; userconfig /Users/jiggs/.npmrc
@haiku:registry = "https://reservoir.haiku.ai:8910/"

; node bin location = /Users/jiggs/.nvm/versions/node/v10.16.3/bin/node
; cwd = /Users/jiggs/projects/haiku/diez/src/compiler/compiler-core
; HOME = /Users/jiggs
; "npm config ls -l" to show all defaults.
      `),
    ],
  });

  test('returns expected values', async () => {
    expect(await packageManager.canUseNpm('/Users/jiraffe/projects/haiku/diez/src/compiler/compiler-core')).toBe(false);
    expect(await packageManager.canUseNpm('/Users/jiggs/projects/haiku/diez/src/compiler/compiler-core')).toBe(true);
  });

  test('returns true if npm returns an invalid value', async () => {
    mockedSpawnSync.mockReturnValueOnce(null);
    expect(await packageManager.canUseNpm('/does/not/matter')).toBe(true);
  });

  test('returns true if cant find npm cwd in npm output', async () => {
    mockedSpawnSync.mockReturnValue({
      output: [
        null,
        Buffer.alloc(0, ''),
      ],
    });

    expect(await packageManager.canUseNpm('/does/not/matter')).toBe(true);
  });
});

describe('shouldUseYarn', () => {
  test('returns false if cant execute the yarn command', async () => {
    jest.spyOn(utils, 'canRunCommand').mockReturnValueOnce(Promise.resolve(false));
    expect(await packageManager.shouldUseYarn()).toBe(false);
  });

  test('returns true if can execute the yarn command', async () => {
    jest.spyOn(utils, 'canRunCommand').mockReturnValueOnce(Promise.resolve(true));
    expect(await packageManager.shouldUseYarn()).toBe(true);
  });
});

describe('PackageManager', () => {
  test('when npm is detected as the package manager of choice', async () => {
    const pm = new packageManager.PackageManager(PackageManagers.Npm);
    expect(pm.binary).toBe('npm');
    const addDependencyPromise = pm.addDependency('my-dependency');
    mockedSpawnTask.emit('close');
    await addDependencyPromise;
    expect(mockedSpawn).toHaveBeenCalledWith('npm', ['install', 'my-dependency'], {});
    const installAllDependenciesPromise = pm.installAllDependencies();
    mockedSpawnTask.emit('close');
    await installAllDependenciesPromise;
    expect(mockedExec).toHaveBeenCalledWith('npm install', undefined, expect.anything());
  });

  test('when yarn is detected as the package manager of choice', async () => {
    const pm = new packageManager.PackageManager(PackageManagers.Yarn);
    expect(pm.binary).toBe('yarn');
    const addDependencyPromise = pm.addDependency('my-dependency');
    mockedSpawnTask.emit('close');
    await addDependencyPromise;
    expect(mockedSpawn).toHaveBeenCalledWith('yarn', ['add', 'my-dependency'], {});
    const installAllDependenciesPromise = pm.installAllDependencies();
    mockedSpawnTask.emit('close');
    await installAllDependenciesPromise;
    expect(mockedExec).lastCalledWith('yarn install', undefined, expect.anything());
  });
});

describe('getPackageManager', () => {
  test('throws if it cant use npm or yarn', async () => {
    jest.spyOn(packageManager, 'shouldUseYarn').mockReturnValueOnce(Promise.resolve(false));
    jest.spyOn(packageManager, 'canUseNpm').mockReturnValueOnce(Promise.resolve(false));
    expect(packageManager.getPackageManager()).rejects.toMatch('Unable to start an NPM process.');
  });

  test('returns a package manager instance', async () => {
    jest.spyOn(packageManager, 'shouldUseYarn').mockReturnValueOnce(Promise.resolve(false));
    const pm = await packageManager.getPackageManager();
    expect(pm).toBeInstanceOf(packageManager.PackageManager);
    expect(pm.binary).toBeDefined();
  });

  test('returns a cached version of the package manager', async () => {
    jest.spyOn(packageManager, 'shouldUseYarn').mockReturnValueOnce(Promise.resolve(false));
    expect(await packageManager.getPackageManager()).toBe(await packageManager.getPackageManager());
  });
});
