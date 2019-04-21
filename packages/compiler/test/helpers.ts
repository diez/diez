import {existsSync, readdirSync, readFileSync, writeFileSync} from 'fs-extra';
import {join} from 'path';
import {Compiler} from '../src/compiler';
import {createProject} from '../src/utils';

const workspaceExamplesRoot = join(__dirname, '..', '..', '..', 'examples');
const fixturesRoot = join(__dirname, 'fixtures');
const stubProjectRoot = join(workspaceExamplesRoot, 'stub');

/**
 * Gets all fixtures by name.
 */
export const getFixtures = () => readdirSync(fixturesRoot);

/**
 * Generates a program for the specified fixtures.
 */
export const createProgramForFixture = async (fixture: string) => {
  if (!existsSync(stubProjectRoot)) {
    await createProject('stub', workspaceExamplesRoot);
  }

  writeFileSync(
    join(stubProjectRoot, 'src', 'index.ts'),
    readFileSync(join(fixturesRoot, fixture, `${fixture}.ts`)),
  );

  return new Compiler(stubProjectRoot, '/dev/null');
};
