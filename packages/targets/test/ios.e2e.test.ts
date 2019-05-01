import {registerExpectations} from '@diez/test-utils';
import {join} from 'path';
import {
  createIosCompilerForFixture,
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
      const compiler = await createIosCompilerForFixture(fixture);
      await compiler.run();
      await compiler.writeSdk('foo.bar', 9001);
      expect(join(compiler.program.options.outputPath, 'Diez')).toMatchDirectory(getGoldenRoot(fixture, 'ios'));
    });
  }
});
