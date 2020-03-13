// Monkey-patch `require()` so the `.diezrc` autodiscovery mechanism can work across monorepos.
import {addPath} from 'app-module-path';
// This module needs especial interop settings to be `import`ed
// tslint:disable-next-line: no-var-requires
const {Module} = require('module');
for (const requirePath of Module._nodeModulePaths(global.process.cwd())) {
  addPath(requirePath);
}

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
