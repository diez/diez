import {mockFileSystem} from '@diez/test-utils';
import {Stats} from 'fs';
import {basename, dirname} from 'path';

export const walkSync = (
  directory: string,
  callback: (basedir: string, filename: string, stats: Partial<Stats>) => void,
) => {
  for (const path in mockFileSystem) {
    const basedir = dirname(path);
    const filename = basename(path);
    if (mockFileSystem[path] === 'FOLDER') {
      callback(basedir, filename, {isFile: () => false});
    } else {
      callback(basedir, filename, {isFile: () => true});
    }
  }
};
