import {extend} from 'expect';
import {existsSync, readFileSync} from 'fs';
import {walkSync} from 'fs-walk';
import jestDiff from 'jest-diff';
import {NO_DIFF_MESSAGE} from 'jest-diff/build/constants';
import {join, relative, resolve} from 'path';

const getDiff = (sourceFile: string, goldenFile: string): string | null => {
  if (!existsSync(goldenFile)) {
    // This should never happen.
    return null;
  }

  if (!existsSync(sourceFile)) {
    return `${sourceFile} does not exist, but is required to match ${goldenFile}.`;
  }

  const diff = jestDiff(readFileSync(sourceFile).toString(), readFileSync(goldenFile).toString());
  if (diff === NO_DIFF_MESSAGE) {
    return null;
  }

  return diff;
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
  const diff = getDiff(sourceFile, goldenFile);

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

/**
 * Expectation that directories have the same contents.
 */
const toMatchDirectory = (sourceDirectory: string, goldenDirectory: string, blacklist = new Set<string>()) => {
  const failures = new Map<string, string>();

  walkSync(goldenDirectory, (basedir, filename, stats) => {
    const relativePath = join(relative(goldenDirectory, basedir), filename);
    if (!stats.isFile() || blacklist.has(relativePath)) {
      return;
    }

    const expectedSourceFile = resolve(sourceDirectory, relative(goldenDirectory, basedir), filename);
    const diff = getDiff(join(basedir, filename), expectedSourceFile);
    if (diff) {
      failures.set(
        relativePath,
        diff,
      );
    }
  });

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
