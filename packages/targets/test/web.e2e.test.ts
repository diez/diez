import {registerExpectations} from '@diez/test-utils';
import {join} from 'path';
import {
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
      const compiler = await createWebCompilerForFixture(fixture);
      await compiler.run();
      await compiler.writeSdk('foo.bar', 9001);
      expect(join(compiler.program.destinationPath, 'diez')).toMatchDirectory(getGoldenRoot(fixture, 'web'));
    });
  }
});
