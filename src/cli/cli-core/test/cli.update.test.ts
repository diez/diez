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

jest.mock('package-json', () => {
  return () => {
    return {
      version: '10.10.10',
      versions: {'10.10.10': {}, '9.9.9': {}},
    };
  };
});

const mockedWriteJSONSync = jest.fn();

jest.mock('fs-extra', () => {
  return {
    writeJSONSync: mockedWriteJSONSync,
    readFileSync () {
      return JSON.stringify({
        name: 'lorem-ipsum',
        private: true,
        main: 'lib/index.js',
        version: '8.8.8',
        dependencies: {
          '@diez/engine': '^8.8.8',
          '@diez/prefabs': '^8.8.8',
        },
        devDependencies: {
          '@diez/compiler-core': '^8.8.8',
          '@diez/extractors': '^8.8.8',
          '@diez/start': '^8.8.8',
          '@diez/stdlib': '^8.8.8',
          diez: '^8.8.8',
          semver: '^6.0.0',
          typescript: '^3.7.2',
        },
        optionalDependencies: {
          '@diez/optional': '^8.7.8',
        },
        scripts: {
          start: 'diez start',
          demo: 'diez start web',
        },
      });
    },
  };
});

import updateAction from '../src/commands/update.action';

describe('cli.update', () => {
  test('allows to set a version via a flag', async () => {
    await updateAction({toVersion: '9.9.9'});
    expect(mockedWriteJSONSync).toHaveBeenCalledWith(
      './package.json',
      expect.objectContaining({
        devDependencies: expect.objectContaining({diez: '^9.9.9'}),
        dependencies: expect.objectContaining({'@diez/engine': '^9.9.9'}),
        optionalDependencies: expect.objectContaining({'@diez/optional': '^9.9.9'}),
      }),
      expect.objectContaining({spaces: 2}),
    );
  });

  test('throws an error if the provided version is invalid', async () => {
    await expect(updateAction({toVersion: 'invalid-version'})).rejects.toThrow('Invalid version provided.');
  });

  test('throws an error if the provided version is non-existent', async () => {
    await expect(updateAction({toVersion: '4.4.4'})).rejects.toThrow('Invalid version provided.');
  });

  test('updates to the latest version if no version is provided', async () => {
    await updateAction({});
    expect(mockedWriteJSONSync).toHaveBeenCalledWith(
      './package.json',
      expect.objectContaining({
        devDependencies: expect.objectContaining({diez: '^10.10.10'}),
        dependencies: expect.objectContaining({'@diez/engine': '^10.10.10'}),
        optionalDependencies: expect.objectContaining({'@diez/optional': '^10.10.10'}),
      }),
      expect.objectContaining({spaces: 2}),
    );

    expect(mockedExec).lastCalledWith('npm install', undefined, expect.anything());
  });
});
