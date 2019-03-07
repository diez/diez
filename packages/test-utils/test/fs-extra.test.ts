import {emptyDir, mkdirp, pathExists, readFile, writeFile} from '../src/__mocks__/fs-extra';
import {cleanupMockFileSystem} from '../src/utils';

afterEach(cleanupMockFileSystem);

describe('fs-extra mock', () => {
  test('basic functionality', () => {
    mkdirp('/foo/bar/baz');
    expect(pathExists('/foo')).toBe(true);
    expect(pathExists('/foo/bar')).toBe(true);
    expect(pathExists('/foo/bar/baz')).toBe(true);

    expect(readFile('/foo')).toBe('FOLDER');
    expect(readFile('/foo/bar')).toBe('FOLDER');
    expect(readFile('/foo/bar/baz')).toBe('FOLDER');

    writeFile('/foo/bar/baz/bat', 'hello world');
    expect(pathExists('/foo/bar/baz/bat')).toBe(true);
    expect(readFile('/foo/bar/baz/bat')).toBe('hello world');

    expect(() => mkdirp('/foo/bar/baz/bat/boop')).toThrow();

    emptyDir('/foo/bar/baz');
    expect(pathExists('/foo/bar/baz')).toBe(true);
    expect(pathExists('/foo/bar/baz/bat')).toBe(false);
    expect(() => readFile('/foo/bar/baz/bat')).toThrow();
  });
});
