import {getTempFileName} from '@diez/storage';
import {ensureDirSync, removeSync, writeFileSync} from 'fs-extra';
import {join} from 'path';
import {Program} from '../src/compiler';
import {projectCache} from '../src/utils';

const tempLocation = getTempFileName();

beforeEach(() => {
  ensureDirSync(join(tempLocation, 'src'));
});

afterEach(() => {
  removeSync(tempLocation);
});

describe('compiler errors', () => {
  test('invalid program', async () => {
    const makeProgram = () => new Program(tempLocation, {target: 'foo'});
    expect(makeProgram).toThrow();
    projectCache.clear();

    writeFileSync(join(tempLocation, 'tsconfig.json'), '');
    expect(makeProgram).toThrow();
    projectCache.clear();

    writeFileSync(join(tempLocation, 'src', 'index.ts'), '');
    expect(makeProgram).toThrow();
    projectCache.clear();

    writeFileSync(
      join(tempLocation, 'tsconfig.json'),
      JSON.stringify({compilerOptions: {rootDir: 'src', outDir: 'lib'}}),
    );
    projectCache.clear();
    expect(makeProgram).not.toThrow();
    // The second time, this should be retrieved from the cache.
    expect(makeProgram).not.toThrow();

    // Write invalid TypeScript.
    writeFileSync(
      join(tempLocation, 'tsconfig.json'),
      JSON.stringify({compilerOptions: {rootDir: 'src', outDir: 'lib', noEmitOnError: true}}),
    );
    writeFileSync(join(tempLocation, 'src', 'index.ts'), 'export const foo: string = 42;');
    projectCache.clear();
    const program = makeProgram();
    await expect(program.run()).rejects.toThrow();
  });
});
