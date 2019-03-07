// @ts-ignore
import {WritableMock} from 'stream-mock';
import {mockFileSystem} from '../mockUtils';

const fsExtra = jest.genMockFromModule('fs-extra');

export const writeFile = (fullPath: string, content: string) => {
  mockFileSystem[fullPath] = content;
  return true;
};

export const readFile = (fullPath: string) => {
  return mockFileSystem[fullPath];
};

export const emptyDir = (dirpath: string) => {
  Object.keys(mockFileSystem).forEach((dir) => {
    if (dir.includes(dirpath)) {
      delete mockFileSystem[dirpath];
    }
  });

  mockFileSystem[dirpath] = 'FOLDER';

  return true;
};

export const mkdirp = (dirpath: string) => {
  mockFileSystem[dirpath] = 'FOLDER';
  return true;
};

export const pathExists = (path: string) => {
  return mockFileSystem[path] !== undefined;
};

export const existsSync = () => {
  return true;
};

export const unlink = () => {
  return true;
};

export const createWriteStream = (out: string) => {
  const stream = new WritableMock();
  stream.close = () => {
    writeFile(out, 'mockcontent');
  };
  return stream;
};

export default fsExtra;
