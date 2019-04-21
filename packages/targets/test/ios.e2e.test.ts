import {registerExpectations} from '@diez/test-utils';
import {join} from 'path';
import {
  createIosCompilerForFixture,
  createProgramForFixture,
  getFixtures,
  getGoldenRoot,
} from './helpers';

beforeAll(() => {
  // Allow 1 minute per test. Hopefully they don't actually take that long!
  jest.setTimeout(6e5);
  registerExpectations();
});

describe('ios.e2e', () => {
  for (const fixture of getFixtures()) {
    test(`ios.e2e.${fixture}`, async () => {
      // Resets modules to clear the require cache. Necessary because we reuse the stub project over and over.
      jest.resetModules();
      const program = await createProgramForFixture(fixture);
      const compiler = await createIosCompilerForFixture(fixture, program);
      await compiler.run();
      await compiler.writeSdk('foo.bar', 9001);
      expect(join(program.destinationPath, 'Diez')).toMatchDirectory(getGoldenRoot(fixture, 'ios'));
    });
  }
});
