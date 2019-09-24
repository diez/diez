const mockCanRunCommand = jest.fn();
jest.doMock('@diez/cli-core', () => ({
  ...jest.requireActual('@diez/cli-core'),
  canRunCommand: mockCanRunCommand,
}));
mockCanRunCommand.mockResolvedValue(true);

import {execAsync} from '@diez/cli-core';
import {getTempFileName} from '@diez/storage';
import {registerExpectations} from '@diez/test-utils';
import {ensureDirSync, ensureFileSync, removeSync} from 'fs-extra';
import {join} from 'path';
import {initializeGitRepository} from '../src/utils.git';

let temporaryDirectory = '';

beforeEach(() => {
  temporaryDirectory = getTempFileName();
  ensureDirSync(temporaryDirectory);
});

afterEach(() => {
  removeSync(temporaryDirectory);
});

registerExpectations();

describe('initializing a new git repository', () => {
  test('success', async () => {
    ensureFileSync(join(temporaryDirectory, 'file.txt'));

    await expect(initializeGitRepository(temporaryDirectory)).resolves.toBeUndefined();
    expect(join(temporaryDirectory, '.git')).toExist();
  });

  test('git does not exist failure', async () => {
    mockCanRunCommand.mockResolvedValueOnce(false);

    const error = 'Git not found.';
    await expect(initializeGitRepository(temporaryDirectory)).rejects.toThrow(error);
    expect(join(temporaryDirectory, '.git')).not.toExist();
  });

  test('in existing git respository failure', async () => {
    await execAsync('git init', {cwd: temporaryDirectory});

    const error = 'The provided directory is already in a Git repository.';
    await expect(initializeGitRepository(temporaryDirectory)).rejects.toThrow(error);
    expect(join(temporaryDirectory, '.git')).toExist();
  });

  test('adding files failure', async () => {
    // `git commit` fails when attempted without any files to commit.

    const error = 'Failed to create initial commit.';
    await expect(initializeGitRepository(temporaryDirectory)).rejects.toThrow(error);
    expect(join(temporaryDirectory, '.git')).not.toExist();
  });
});
