import {copySync, removeSync} from 'fs-extra';
import {
  buildRoot,
  createAndroidCompilerForFixture,
  createIosCompilerForFixture,
  createWebCompilerForFixture,
  getFixtures,
  getGoldenRoot,
} from '../test/helpers';

removeSync(buildRoot);
(async () => {
  for (const fixture of getFixtures()) {
    const goldenRoot = getGoldenRoot(fixture);
    removeSync(goldenRoot);

    // Regenerates iOS goldens.
    const iosCompiler = await createIosCompilerForFixture(fixture);
    await iosCompiler.run();
    await iosCompiler.writeSdk();

    // Regenerates Android goldens.
    const androidCompiler = await createAndroidCompilerForFixture(fixture);
    await androidCompiler.run();
    await androidCompiler.writeSdk();

    // Regenerates web goldens.
    const webCompiler = await createWebCompilerForFixture(fixture);
    await webCompiler.run();
    await webCompiler.writeSdk();

    copySync(buildRoot, goldenRoot);
  }
})();
