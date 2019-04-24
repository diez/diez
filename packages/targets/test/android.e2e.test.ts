import {registerExpectations} from '@diez/test-utils';
import {join} from 'path';
import {
  createAndroidCompilerForFixture,
  getFixtures,
  getGoldenRoot,
} from './helpers';

beforeAll(() => {
  // Allow 1 minute per test. Hopefully they don't actually take that long!
  jest.setTimeout(6e5);
  registerExpectations();
});

describe('android.e2e', () => {
  for (const fixture of getFixtures()) {
    test(`android.e2e.${fixture}`, async () => {
      // Resets modules to clear the require cache. Necessary because we reuse the stub project over and over.
      jest.resetModules();
      const compiler = await createAndroidCompilerForFixture(fixture);
      await compiler.run();
      await compiler.writeSdk('foo.bar', 9001);
      expect(join(compiler.program.destinationPath, 'diez')).toMatchDirectory(getGoldenRoot(fixture, 'android'));
    });
  }
});
