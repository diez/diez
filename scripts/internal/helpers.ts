/* tslint:disable:no-var-requires max-line-length */
import {execSync, StdioOptions} from 'child_process';
import {existsSync, readFile, writeFile} from 'fs-extra';
import {join} from 'path';

/**
 * The root of the monorepo.
 */
export const root = global.process.cwd();

/**
 * The root of the site.
 */
export const siteRoot = join(root, 'examples', 'site', 'examples', 'web');

/**
 * The current version of the package.
 */
export const currentVersion = require(join(root, 'packages', 'engine', 'package.json')).version;

/**
 * Runs the provided command synchronously.
 */
export const run = (command: string, cwd = root, stdio: StdioOptions = 'inherit') => execSync(command, {cwd, stdio});

/**
 * Runs the provided command synchronously in band.
 */
export const runQuiet = (command: string, cwd = root) => execSync(command, {cwd, stdio: 'pipe'}).toString().trim();

/**
 * The location of the watchfile indicating a watch is active.
 */
export const watchMutex = join(root, '.watching');

/**
 * Checks if the watch mutex is active, and fails if it is.
 */
export const assertNotWatching = () => {
  if (existsSync(watchMutex)) {
    throw new Error(`It appears that yarn watch is active; for your own safety, you cannot run this command with an active watcher.

If this is an error, please manually remove .watching from the monorepo root and try again.`);
  }
};

/**
 * Replaces a list of patterns in a given string.
 */
export const replaceOccurrencesInString = (contents: string, replacements: Map<string, string>) =>
  contents.replace(
    new RegExp(Array.from(replacements.keys()).join('|'), 'g'),
    (match) => replacements.get(match)!,
  );

/**
 * Replaces a list of patterns in a given file.
 */
export const replaceOccurrencesInFile = (filename: string, replacements: Map<string, string>) =>
  readFile(filename).then((data) => {
    return writeFile(filename, replaceOccurrencesInString(data.toString(), replacements));
  });
