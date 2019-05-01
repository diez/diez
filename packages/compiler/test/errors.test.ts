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
    const makeComponent = () => new Program(tempLocation, {outputPath: '/dev/null', target: 'foo'});
    expect(makeComponent).toThrow();

    writeFileSync(join(tempLocation, 'tsconfig.json'), '');
    expect(makeComponent).toThrow();

    writeFileSync(join(tempLocation, 'src', 'index.ts'), '');
    expect(makeComponent).toThrow();

    writeFileSync(
      join(tempLocation, 'tsconfig.json'),
      JSON.stringify({compilerOptions: {rootDir: 'src'}}),
    );

    expect(makeComponent).not.toThrow();
  });
});
