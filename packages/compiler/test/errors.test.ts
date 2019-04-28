import {ensureDirSync, removeSync, writeFileSync} from 'fs-extra';
import {join} from 'path';
import {Program} from '../src/compiler';
import {getTempFileName} from '../src/utils';

const tempLocation = getTempFileName();

beforeEach(() => {
  ensureDirSync(join(tempLocation, 'src'));
});

afterEach(() => {
  removeSync(tempLocation);
});

describe('compiler errors', () => {
  test('invalid program', () => {
    const expectThrow = () => expect(() => new Program(tempLocation, '/dev/null', 'foo')).toThrow();
    expectThrow();

    writeFileSync(join(tempLocation, 'tsconfig.json'), '');
    expectThrow();

    writeFileSync(join(tempLocation, 'src', 'index.ts'), '');
    expectThrow();

    writeFileSync(
      join(tempLocation, 'tsconfig.json'),
      JSON.stringify({compilerOptions: {rootDir: 'src', outDir: 'dist'}}),
    );
    expectThrow();

    writeFileSync(join(tempLocation, 'package.json'), JSON.stringify({main: 'dist/index.js'}));
    expectThrow();

    writeFileSync(
      join(tempLocation, 'tsconfig.json'),
      JSON.stringify({compilerOptions: {rootDir: 'src', outDir: 'lib'}}),
    );
    expectThrow();

    writeFileSync(join(tempLocation, 'package.json'), JSON.stringify({main: 'lib/index.js'}));
    expect(() => new Program(tempLocation, '/dev/null', 'foo')).not.toThrow();
  });
});
