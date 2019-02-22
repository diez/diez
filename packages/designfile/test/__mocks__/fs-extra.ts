// @ts-ignore
import {WritableMock} from 'stream-mock';

const fsExtra: any = jest.genMockFromModule('fs-extra');

export let __fileSystem: {[key: string]: string} = {};

export const writeFile = (fullPath: string, content: string) => {
  __fileSystem[fullPath] = content;
  return true;
};

export const readFile = (fullPath: string) => {
  return __fileSystem[fullPath];
};

export const emptyDir = (dirpath: string) => {
  Object.keys(__fileSystem).forEach((dir) => {
    if (dir.includes(dirpath)) {
      delete __fileSystem[dirpath];
    }
  });

  __fileSystem[dirpath] = 'FOLDER';

  return true;
};

export const mkdirp = (dirpath: string) => {
  __fileSystem[dirpath] = 'FOLDER';
  return true;
};

export const pathExists = (path: string) => {
  return __fileSystem[path] !== undefined;
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

export const __cleanup = () => {
  __fileSystem = {};
};

export default fsExtra;
