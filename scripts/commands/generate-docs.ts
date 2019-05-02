import {fatalError} from '@diez/cli-core';
import {Stats} from 'fs-extra';
import {walkSync} from 'fs-walk';
import {extname, join, relative, sep} from 'path';
import {Project} from 'ts-morph';
import {assertNotWatching, root, run, runQuiet} from '../internal/helpers';

const packageRoot = join(root, 'packages');

export = {
  name: 'generate-docs',
  description: 'Generates docs.',
  action: async () => {
    assertNotWatching();
    const gitChanges = runQuiet('git diff packages');
    if (gitChanges) {
      fatalError('Found untracked Git changes in packages/. Stash them before generating docs.');
    }

    const project = new Project();

    walkSync(join(root, 'packages'), (basedir: string, filename: string, stats: Stats) => {
      if (!stats.isFile() || extname(filename) !== '.ts' || !basedir.includes(`${sep}src`)) {
        return;
      }

      // Look for imports like:
      //   import {foo, bar} from '@diez/baz';
      const path = join(basedir, filename);
      const sourceFile = project.addExistingSourceFile(path);
      for (const declaration of sourceFile.getImportDeclarations()) {
        if (!declaration.getModuleSpecifierValue().startsWith('@diez/')) {
          continue;
        }

        // Rewrite the first import path component as the relative location so typedoc can resolve it.
        // Rewrite the third (which might not exist) to resolve source files specifically.
        const importPathComponents = declaration.getModuleSpecifierValue().split('/');
        importPathComponents[0] = relative(basedir, packageRoot);
        importPathComponents[2] = 'src';

        declaration.setModuleSpecifier(importPathComponents.join('/'));
      }

      for (const namespace of sourceFile.getNamespaces()) {
        if (!namespace.getName().startsWith("'@diez/")) {
          continue;
        }

        const pathComponents = namespace.getName().replace(/'/g, '').replace('types', 'src').split('/');
        pathComponents[0] = relative(basedir, packageRoot);
        namespace.getNameNodes()[0].replaceWithText(`'${pathComponents.join('/')}'`);
      }
    });

    await project.save();

    run('yarn typedoc');
    run('git checkout packages');
  },
};
