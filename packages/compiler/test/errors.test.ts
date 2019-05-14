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
  test('invalid program', () => {
    const makeComponent = () => new Program(tempLocation, {outputPath: '/dev/null', target: 'foo'});
    expect(makeComponent).toThrow();
    projectCache.clear();

    writeFileSync(join(tempLocation, 'tsconfig.json'), '');
    expect(makeComponent).toThrow();
    projectCache.clear();

    writeFileSync(join(tempLocation, 'src', 'index.ts'), '');
    expect(makeComponent).toThrow();
    projectCache.clear();

    writeFileSync(
      join(tempLocation, 'tsconfig.json'),
      JSON.stringify({compilerOptions: {rootDir: 'src', outDir: 'lib'}}),
    );
    projectCache.clear();
    expect(makeComponent).not.toThrow();
    // The second time, this should be retrieved from the cache.
    expect(makeComponent).not.toThrow();
  });
});
