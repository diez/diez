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
  jest.setTimeout(6e4);
  registerExpectations();
});

jest.mock('fontkit', () => ({
  openSync: () => ({postscriptName: 'SomeFont'}),
}));

describe('targets.e2e', () => {
  for (const fixture of getFixtures()) {
    test(`targets.e2e.${fixture}`, async () => {
      // Resets modules to clear the require cache. Necessary because we reuse the stub project over and over.
      jest.resetModules();

      const iosCompiler = await createIosCompilerForFixture(fixture);
      await iosCompiler.start();

      const androidCompiler = await createAndroidCompilerForFixture(fixture);
      await androidCompiler.start();

      const webCompiler = await createWebCompilerForFixture(fixture);
      await webCompiler.start();

      expect(buildRoot).toMatchDirectory(getGoldenRoot(fixture));
    });
  }
});
