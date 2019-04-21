import {removeSync} from 'fs-extra';
import {
  createAndroidCompilerForFixture,
  createIosCompilerForFixture,
  createProgramForFixture,
  getFixtures,
  getGoldenRoot,
} from '../test/helpers';

(async () => {
  for (const fixture of getFixtures()) {
    const program = await createProgramForFixture(fixture);

    // Regenerates iOS goldens.
    const iosGoldenRoot = getGoldenRoot(fixture, 'ios');
    const iosCompiler = await createIosCompilerForFixture(fixture, program, iosGoldenRoot);
    await iosCompiler.run();
    removeSync(iosGoldenRoot);
    await iosCompiler.writeSdk('foo.bar', 9001);

    // Regenerates Android goldens.
    const androidGoldenRoot = getGoldenRoot(fixture, 'android');
    const androidCompiler = await createAndroidCompilerForFixture(fixture, program, androidGoldenRoot);
    await androidCompiler.run();
    removeSync(androidGoldenRoot);
    await androidCompiler.writeSdk('foo.bar', 9001);
  }
})();
