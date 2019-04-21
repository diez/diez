import {extend} from 'expect';
import {existsSync, readFileSync} from 'fs';
import {walkSync} from 'fs-walk';
import {join, relative, resolve} from 'path';

const fileContentsMatch = (sourceFile: string, goldenFile: string) =>
  existsSync(sourceFile) &&
  existsSync(goldenFile) &&
  readFileSync(sourceFile).toString() === readFileSync(goldenFile).toString();

/**
 * Expectation that files have the same contents.
 */
const toMatchFile = (sourceFile: string, goldenFile: string) => {
  if (fileContentsMatch(sourceFile, goldenFile)) {
    return {
      message: () => `expected ${sourceFile} not to match ${goldenFile}`,
      pass: true,
    };
  }

  return {
    message: () => `expected ${sourceFile} to match ${goldenFile}`,
    pass: false,
  };
};

/**
 * Expectation that directories have the same contents.
 */
const toMatchDirectory = (sourceDirectory: string, goldenDirectory: string) => {
  const failures: string[] = [];

  walkSync(goldenDirectory, (basedir, filename, stats) => {
    if (!stats.isFile()) {
      return;
    }

    const expectedSourceFile = resolve(sourceDirectory, relative(goldenDirectory, basedir), filename);
    if (!fileContentsMatch(join(basedir, filename), expectedSourceFile)) {
      failures.push(join(relative(goldenDirectory, basedir), filename));
    }
  });

  if (failures.length === 0) {
    return {
      message: () => `expected ${sourceDirectory} not to match ${goldenDirectory}`,
      pass: true,
    };
  }

  return {
    message: () => `expected ${sourceDirectory} to match ${goldenDirectory}, but the following files were different:
    ${failures.join(', ')}`,
    pass: false,
  };
};

/**
 * Provides additional Jest expectations.
 */
export const registerExpectations = () => {
  extend({toMatchFile, toMatchDirectory});
};
