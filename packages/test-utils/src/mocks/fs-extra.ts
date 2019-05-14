import {sep} from 'path';
// @ts-ignore
import {WritableMock} from 'stream-mock';

/**
 * Provides a mock directory format for the mock filesystem.
 */
export interface MockDirectory {
  [key: string]: string | MockDirectory;
}

/**
 * Mock filesystem.
 */
export const mockFileSystem: MockDirectory = {};

/**
 * Resets the mock filesystem to initial state.
 */
export const cleanupMockFileSystem = () => {
  for (const key in mockFileSystem) {
    delete mockFileSystem[key];
  }
};

/**
 * Module mock factory.
 */
export const mockFsExtraFactory = () => {
  const pathExists = (path: string) => mockFileSystem[path] !== undefined;
  const emptyDir = (dirpath: string) => {
    Object.keys(mockFileSystem).forEach((dir) => {
      if (dir.startsWith(dirpath)) {
        delete mockFileSystem[dir];
      }
    });

    mockFileSystem[dirpath] = 'FOLDER';
  };
  const writeFile = (fullPath: string, content: string) => {
    mockFileSystem[fullPath] = content;
  };

  return {
    ...jest.requireActual('fs-extra'),
    pathExists,
    emptyDir,
    writeFile,
    readFile (fullPath: string) {
      if (!pathExists(fullPath)) {
        throw new Error('File does not exist');
      }

      return mockFileSystem[fullPath];
    },
    removeSync (path: string) {
      emptyDir(path);
      delete mockFileSystem[path];
    },
    mkdirp (dirpath: string) {
      const segments = dirpath.slice(1).split('/');
      let dirCursor = dirpath[0];
      for (let i = 0; i < segments.length;) {
        dirCursor += segments[i];
        if (pathExists(dirCursor) && mockFileSystem[dirCursor] !== 'FOLDER') {
          throw new Error('mkdirp encountered a file');
        }
        mockFileSystem[dirCursor] = 'FOLDER';
        if (++i < segments.length) {
          dirCursor += sep;
        }
      }
    },
    unlink (path: string, callback: () => void) {
      delete mockFileSystem[path];
      setImmediate(callback);
      return true;
    },
    createWriteStream (out: string) {
      const stream = new WritableMock();
      stream.close = () => {
        writeFile(out, 'mockcontent');
      };
      return stream;
    },
    readJson (path: string) {
      return JSON.parse(mockFileSystem[path] as string);
    },
    writeJson (path: string, content: any) {
      writeFile(path, JSON.stringify(content));
    },
  };
};
