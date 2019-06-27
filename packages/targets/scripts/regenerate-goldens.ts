import fontkit from 'fontkit';
import {copySync, removeSync} from 'fs-extra';
import {
  buildRoot,
  createAndroidCompilerForFixture,
  createIosCompilerForFixture,
  createWebCompilerForFixture,
  getFixtures,
  getGoldenRoot,
} from '../test/helpers';

// Monkey-patch `loadSync` from `opentype.js` so our font validator works.
Object.assign(fontkit, {
  openSync: () => ({postscriptName: 'SomeFont'}),
});

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

    // Regenerates Web goldens.
    const webCompiler = await createWebCompilerForFixture(fixture, {js: true, css: true, scss: true});
    await webCompiler.run();
    await webCompiler.writeSdk();

    copySync(buildRoot, goldenRoot);
  }
})();
