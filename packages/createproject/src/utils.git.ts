import {canRunCommand, execAsync} from '@diez/cli-core';
import {ExecOptions} from 'child_process';
import {remove} from 'fs-extra';
import {join} from 'path';

/**
 * Provides an async check for if we are equipped to use `git`.
 */
const canUseGit = () => canRunCommand('git --version');

/**
 * Checks if the provided path is within a git repository.
 *
 * @param root The path to check.
 */
const isInGitRepository = async (root: string) => {
  try {
    await execAsync('git rev-parse --is-inside-work-tree', {cwd: root});
    return true;
  } catch {
    return false;
  }
};

/**
 * Attempts to initilaize a git repository in the provided directory.
 *
 * @param root The directory to attempt to initialize a git repository in.
 *
 * @ignore
 */
export const initializeGitRepository = async (root: string) => {
  if (!await canUseGit()) {
    throw new Error('Git not found.');
  }

  if (await isInGitRepository(root)) {
    throw new Error('The provided directory is already in a git repository.');
  }

  const options: ExecOptions = {cwd: root};

  try {
    await execAsync('git init', options);
  } catch {
    throw new Error('Failed to initialize the git repository.');
  }

  try {
    await execAsync('git add .', options);
    await execAsync('git commit -m "Initial commit."', options);
  } catch {
    // We need to clean up the .git directory since the git repository was already succesfully initialized above.
    await remove(join(root, '.git'));
    throw new Error('Failed to create initial commit.');
  }
};
