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

jest.mock('package-json', () => () => ({
  'dist-tags': {latest: '10.10.10'},
  versions: {'10.10.10': {}, '9.9.9': {}},
}));

const mockedWriteJson = jest.fn();
const mockedReadJson = jest.fn().mockReturnValue(
  Promise.resolve({
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
  }),
);

jest.mock('fs-extra', () => ({
  writeJson: mockedWriteJson,
  readJson: mockedReadJson,
}));

import updateAction from '../src/commands/update.action';

describe('cli.update', () => {
  test('allows to set a version via a flag', async () => {
    await updateAction({toVersion: '9.9.9'});
    expect(mockedWriteJson).toHaveBeenCalledWith(
      './package.json',
      expect.objectContaining({
        devDependencies: expect.objectContaining({diez: '^9.9.9'}),
        dependencies: expect.objectContaining({'@diez/engine': '^9.9.9'}),
        optionalDependencies: expect.objectContaining({
          '@diez/optional': '^9.9.9',
        }),
      }),
      expect.objectContaining({spaces: 2}),
    );
  });

  test('throws an error if the provided version is invalid', async () => {
    await expect(
      updateAction({toVersion: 'invalid-version'}),
    ).rejects.toThrow('Invalid version provided.');
  });

  test('throws an error if the provided version is non-existent', async () => {
    await expect(updateAction({toVersion: '4.4.4'})).rejects.toThrow(
      'Invalid version provided.',
    );
  });

  test('updates to the latest version if no version is provided', async () => {
    await updateAction({});
    expect(mockedWriteJson).toHaveBeenCalledWith(
      './package.json',
      expect.objectContaining({
        devDependencies: expect.objectContaining({diez: '^10.10.10'}),
        dependencies: expect.objectContaining({'@diez/engine': '^10.10.10'}),
        optionalDependencies: expect.objectContaining({
          '@diez/optional': '^10.10.10',
        }),
      }),
      expect.objectContaining({spaces: 2}),
    );

    expect(mockedExec).lastCalledWith(
      'npm install',
      undefined,
      expect.anything(),
    );
  });

  test('throws an error if is not able to find or read a package.json file in the current directory', async () => {
    mockedReadJson.mockReturnValueOnce(Promise.reject());
    await expect(updateAction({toVersion: '10.10.10'})).rejects.toThrow(
      expect.objectContaining({message: expect.stringContaining('Unable to find or read a package.json file')}),
    );
  });

  test('throws an error if there is a problem installing packages', async () => {
    mockedExec.mockImplementation((command, opts, callback) => {
      // @ts-ignore
      callback(new Error('error installing dependencies!'));
    });

    await expect(updateAction({toVersion: '10.10.10'})).rejects.toThrow(
      expect.objectContaining({message: expect.stringContaining('There was an error installing the updated Diez packages')}),
    );
  });
});
