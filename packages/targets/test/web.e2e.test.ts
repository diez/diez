import {registerExpectations} from '@diez/test-utils';
import {join} from 'path';
import {
  createProgramForFixture,
  createWebCompilerForFixture,
  getFixtures,
  getGoldenRoot,
} from './helpers';

beforeAll(() => {
  // Allow 1 minute per test. Hopefully they don't actually take that long!
  jest.setTimeout(6e5);
  registerExpectations();
});

describe('web.e2e', () => {
  for (const fixture of getFixtures()) {
    test(`web.e2e.${fixture}`, async () => {
      // Resets modules to clear the require cache. Necessary because we reuse the stub project over and over.
      jest.resetModules();
      const program = await createProgramForFixture(fixture);
      const compiler = await createWebCompilerForFixture(fixture, program);
      await compiler.run();
      await compiler.writeSdk('foo.bar', 9001);
      expect(join(program.destinationPath, 'diez')).toMatchDirectory(getGoldenRoot(fixture, 'web'));
    });
  }
});
