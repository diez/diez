import {Target} from '@diez/engine';
import {ensureDirSync, removeSync, writeFileSync} from 'fs-extra';
import {join} from 'path';
import {ProjectParser} from '../src/parser';
import {projectCache} from '../src/utils';

const tempLocation = join(__dirname, '.temp');

beforeEach(() => {
  ensureDirSync(join(tempLocation, 'src'));
});

afterEach(() => {
  removeSync(tempLocation);
});

describe('compiler errors', () => {
  test('invalid program', async () => {
    const makeProgram = () => new ProjectParser(tempLocation, {sdkVersion: '10.10.10', target: 'foo' as Target});
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
