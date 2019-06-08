import {extend} from 'expect';
import {existsSync, lstatSync, readdirSync, readFileSync, readlinkSync, Stats} from 'fs-extra';
import jestDiff from 'jest-diff';
import {join, relative, resolve} from 'path';

const getDiff = (sourceFile: string, goldenFile: string, isSymbolicLink: boolean): string | null => {
  if (!existsSync(goldenFile)) {
    // This should never happen.
    return null;
  }

  if (!existsSync(sourceFile)) {
    return `${sourceFile} does not exist, but is required to match ${goldenFile}.`;
  }

  const sourceContents = isSymbolicLink ? readlinkSync(sourceFile) : readFileSync(sourceFile).toString();
  const goldenContents = isSymbolicLink ? readlinkSync(goldenFile) : readFileSync(goldenFile).toString();
  if (sourceContents === goldenContents) {
    return null;
  }

  return jestDiff(sourceContents, goldenContents);
};

/**
 * Expectation that a file exists.
 */
const toExist = (sourceFile: string) => {
  if (existsSync(sourceFile)) {
    return {
      message: () => `expected ${sourceFile} not to exist`,
      pass: true,
    };
  }

  return {
    message: () => `expected ${sourceFile} to exist`,
    pass: false,
  };
};

/**
 * Expectation that files have the same contents.
 */
const toMatchFile = (sourceFile: string, goldenFile: string) => {
  const diff = getDiff(sourceFile, goldenFile, false);

  if (diff) {
    return {
      message: () => `expected ${sourceFile} to match ${goldenFile}, but the contents were different.\n\n${diff}`,
      pass: false,
    };
  }

  return {
    message: () => `expected ${sourceFile} not to match ${goldenFile}, but they were identical`,
    pass: true,
  };
};

const readDirectory = (directoryName: string, catalog: Map<string, Stats>) => {
  for (const filename of readdirSync(directoryName)) {
    const path = join(directoryName, filename);
    if (catalog.has(path)) {
      continue;
    }
    const stats = lstatSync(path);
    catalog.set(path, stats);
    if (stats.isDirectory()) {
      readDirectory(path, catalog);
    }
  }
};

/**
 * Expectation that directories have the same contents.
 */
const toMatchDirectory = (sourceDirectory: string, goldenDirectory: string, blacklist = new Set<string>()) => {
  const failures = new Map<string, string>();
  const catalog = new Map<string, Stats>();
  readDirectory(goldenDirectory, catalog);
  for (const [path, stats] of catalog) {
    const relativePath = relative(goldenDirectory, path);
    if ((!stats.isFile() && !stats.isSymbolicLink()) || blacklist.has(relativePath)) {
      continue;
    }

    const expectedSourceFile = resolve(sourceDirectory, relativePath);
    const diff = getDiff(expectedSourceFile, path, stats.isSymbolicLink());
    if (diff) {
      failures.set(
        relativePath,
        diff,
      );
    }
  }

  if (failures.size === 0) {
    return {
      message: () => `expected ${sourceDirectory} not to match ${goldenDirectory}, but they were identical`,
      pass: true,
    };
  }

  let message = `expected ${sourceDirectory} to match ${goldenDirectory}, but the following files were different:\n\n`;
  for (const [filename, diff] of failures) {
    message += `${filename}\n\n${diff}\n\n`;
  }

  return {
    message: () => message,
    pass: false,
  };
};

/**
 * Provides additional Jest expectations.
 */
export const registerExpectations = () => {
  extend({
    toExist,
    toMatchFile,
    toMatchDirectory,
  });
};
