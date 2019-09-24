import {cleanupMockFileSystem, mockFsExtraFactory} from '../src/mocks/fs-extra';

const {
  createWriteStream,
  emptyDir,
  mkdirp,
  pathExists,
  readFile,
  readJson,
  removeSync,
  unlink,
  writeFile,
  writeJson,
} = mockFsExtraFactory();

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
    removeSync('/foo/bar/baz');
    expect(pathExists('/foo/bar/baz')).toBe(false);

    writeJson('/foo/bar/baz/bat', {foo: 'bar', whoops: () => {}});
    expect(pathExists('/foo/bar/baz/bat')).toBe(true);
    // The function cannot be JSON encoded, so it is erased.
    expect(readJson('/foo/bar/baz/bat')).toEqual({foo: 'bar'});

    const callback = jest.fn();
    unlink('/foo/bar/baz/bat', callback);
    expect(pathExists('/foo/bar/baz/bat')).toBe(false);
    setImmediate(() => {
      expect(callback).toHaveBeenCalled();
    });

    expect(pathExists('/foo/bar/baz/bat')).toBe(false);
    const stream = createWriteStream('/foo/bar/baz/bat');
    stream.write('foobar');
    expect(pathExists('/foo/bar/baz/bat')).toBe(true);
    expect(readFile('/foo/bar/baz/bat')).toBe('foobar');
  });
});
