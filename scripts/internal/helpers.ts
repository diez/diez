/* tslint:disable:no-var-requires max-line-length */
import chalk from 'chalk';
import {execSync, StdioOptions} from 'child_process';
import {existsSync, readFile, writeFile} from 'fs-extra';
import {join} from 'path';

/**
 * The root of the monorepo.
 */
export const root = global.process.cwd();

/**
 * The current version of the package.
 */
export const currentVersion = require(join(root, 'packages', 'engine', 'package.json')).version;

/**
 * Runs the provided command synchronously.
 */
export const run = (command: string, cwd = root, stdio: StdioOptions = 'inherit') => execSync(command, {cwd, stdio});

/**
 * The location of the watchfile indicating a watch is active.
 */
export const watchMutex = join(root, '.watching');

/**
 * Checks if the watch mutex is active, and fails if it is.
 */
export const assertNotWatching = () => {
  if (existsSync(watchMutex)) {
    console.log(chalk.red('It appears that `yarn watch` is active; for your own safety, you cannot run this command with an active watcher.'));
    console.log(chalk.red('If this is an error, please manually remove `.watching` from the monorepo root and try again.'));
    global.process.exit(1);
  }
};

/**
 * Replaces a list of patterns in a given file.
 */
export const replaceInFile = (filename: string, search: string[], replace: string[]) =>
  readFile(filename).then((data) => {
    let contents = data.toString();
    for (let i = 0; i < search.length; ++i) {
      contents = contents.replace(new RegExp(search[i], 'g'), replace[i]);
    }
    return writeFile(filename, contents);
  });
