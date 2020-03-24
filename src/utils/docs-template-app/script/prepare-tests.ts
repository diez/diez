import {spawnSync} from 'child_process';
import {copySync, removeSync} from 'fs-extra';
import {join, resolve} from 'path';
import {buildRoot, createDocsCompilerForFixture, docsAppRoot, e2eLibPath, e2ePath} from '../test/helpers';

(async () => {
  removeSync(e2eLibPath);
  spawnSync(
    'yarn',
    ['tsc', '-p', e2ePath],
    {stdio: 'inherit', cwd: docsAppRoot},
  );
  removeSync(buildRoot);
  const fixture = 'DocsApp';
  const docsCompiler = await createDocsCompilerForFixture(fixture);
  const assetsFolder = resolve(join(docsAppRoot, 'public', 'assets'));
  await docsCompiler.start();
  copySync(join(buildRoot, 'tree.json'), join(assetsFolder, 'tree.json'));
  copySync(join(buildRoot, 'searchIndex.json'), join(assetsFolder, 'searchIndex.json'));
})();
