// @ts-ignore
import {WritableMock} from 'stream-mock';

const fsExtra: any = jest.genMockFromModule('fs-extra');

export let __fileSystem: {[key: string]: string} = {};

fsExtra.writeFile = (fullPath: string, content: string) => {
  __fileSystem[fullPath] = content;
  return true;
};

fsExtra.readFile = (fullPath: string) => {
  return __fileSystem[fullPath];
};

fsExtra.emptyDir = (dirpath: string) => {
  Object.keys(__fileSystem).forEach((dir) => {
    if (dir.includes(dirpath)) {
      delete __fileSystem[dirpath];
    }
  });

  __fileSystem[dirpath] = 'FOLDER';

  return true;
};

fsExtra.mkdirp = (dirpath: string) => {
  __fileSystem[dirpath] = 'FOLDER';
  return true;
};

fsExtra.pathExists = (path: string) => {
  return __fileSystem[path] !== undefined;
};

fsExtra.existsSync = () => {
  return true;
};

fsExtra.createWriteStream = (out: string) => {
  const stream = new WritableMock();
  stream.close = () => {
    fsExtra.writeFile(out, 'mockcontent');
  };
  return stream;
};

export const __cleanup = () => {
  __fileSystem = {};
};

export default fsExtra;
