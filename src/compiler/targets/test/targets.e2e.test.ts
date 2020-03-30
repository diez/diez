import {registerExpectations} from '@diez/test-utils';
import {readJsonSync} from 'fs-extra';
import {join} from 'path';
import {
  buildRoot,
  createAndroidCompilerForFixture,
  createDocsCompilerForFixture,
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

/**
 * Updates the provided package.json object so that the version number field is `-` for any `depedencies` or
 * `devDependencies` that are prefixed with '@diez/'.
 */
const clearPackageJsonDiezVersions = (packageJson: any) => {
  const diezPackagePrefix = '@diez/';
  for (const dependency in packageJson.dependencies) {
    if (dependency.startsWith(diezPackagePrefix)) {
      packageJson.dependencies[dependency] = '-';
    }
  }

  for (const dependency in packageJson.devDependencies) {
    if (dependency.startsWith(diezPackagePrefix)) {
      packageJson.devDependencies[dependency] = '-';
    }
  }
};

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

      const docsCompiler = await createDocsCompilerForFixture(fixture);
      await docsCompiler.start();

      // Ignore the web SDK's package.json in the directory comparison since version numbers may not match after a
      // release has been created but the stub goldens have not been regenerated.
      const packageJsonPath = join('diez-target-test-stub-web', 'package.json');
      const blacklist = new Set([packageJsonPath]);

      const goldenRoot = getGoldenRoot(fixture);
      expect(buildRoot).toMatchDirectory(goldenRoot, blacklist);

      const goldenPackageJson = readJsonSync(join(goldenRoot, packageJsonPath));
      const builtPackageJson = readJsonSync(join(buildRoot, packageJsonPath));

      clearPackageJsonDiezVersions(goldenPackageJson);
      clearPackageJsonDiezVersions(builtPackageJson);

      expect(builtPackageJson).toEqual(goldenPackageJson);
    });
  }
});
