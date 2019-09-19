import {Log} from '@diez/cli-core';
import {Assembler, TargetOutput} from '@diez/compiler';
import {copyFile, ensureDir, writeFile} from 'fs-extra';
import {dirname} from 'path';

/**
 * A base class our assembler implementations should inherit from.
 */
class TestAssembler<T extends TargetOutput> implements Assembler<T> {
  constructor (readonly output: T) {}

  async addCoreFiles () {
    Log.info('Test: add core files.');
  }

  async writeFile (destinationPath: string, contents: string | Buffer) {
    await ensureDir(dirname(destinationPath));
    return writeFile(destinationPath, contents);
  }

  async copyFile (sourcePath: string, destinationPath: string) {
    await ensureDir(dirname(destinationPath));
    return copyFile(sourcePath, destinationPath);
  }
}

export = <T extends TargetOutput>(output: T) => new TestAssembler(output);
