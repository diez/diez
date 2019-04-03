import {execSync, StdioOptions} from 'child_process';
import {readFile, writeFile} from 'fs-extra';
import {join} from 'path';

// tslint:disable-next-line:no-var-requires
export const currentVersion = require(join('..', '..', 'package.json')).version;

export const root = global.process.cwd();

export const run = (command: string, cwd = root, stdio: StdioOptions = 'inherit') => execSync(command, {cwd, stdio});

export const replaceInFile = (filename: string, search: string[], replace: string[]) =>
  readFile(filename).then((data) => {
    let contents = data.toString();
    for (let i = 0; i < search.length; ++i) {
      contents = contents.replace(new RegExp(search[i], 'g'), replace[i]);
    }
    return writeFile(filename, contents);
  });
