import {registerExpectations} from '@diez/test-utils';
import {
  buildRoot,
  createAndroidCompilerForFixture,
  createIosCompilerForFixture,
  createWebCompilerForFixture,
  getFixtures,
  getGoldenRoot,
} from './helpers';

beforeAll(() => {
  // Allow 1 minute per test. Hopefully they don't actually take that long!
  jest.setTimeout(6e5);
  registerExpectations();
});

describe('targets.e2e', () => {
  for (const fixture of getFixtures()) {
    test(`targets.e2e.${fixture}`, async () => {
      // Resets modules to clear the require cache. Necessary because we reuse the stub project over and over.
      jest.resetModules();

      const iosCompiler = await createIosCompilerForFixture(fixture);
      await iosCompiler.run();
      await iosCompiler.writeSdk();

      const androidCompiler = await createAndroidCompilerForFixture(fixture);
      await androidCompiler.run();
      await androidCompiler.writeSdk();

      const webCompiler = await createWebCompilerForFixture(fixture);
      await webCompiler.run();
      await webCompiler.writeSdk();

      expect(buildRoot).toMatchDirectory(getGoldenRoot(fixture));
    });
  }
});
