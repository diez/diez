import {fatalError} from '@diez/cli-core';
import glob from 'glob';
import {dirname, join, relative} from 'path';
import {Project} from 'ts-morph';
import {assertNotWatching, root, run, runQuiet} from '../internal/helpers';

const packageRoot = join(root, 'packages');

interface GenerateDocsOptions {
  theme: string;
}

export = {
  name: 'generate-docs',
  description: 'Generates docs.',
  action: async ({theme}: GenerateDocsOptions) => {
    assertNotWatching();
    const gitChanges = runQuiet('git diff packages');
    if (gitChanges) {
      fatalError('Found untracked Git changes in packages/. Stash them before generating docs.');
    }

    const project = new Project();

    const filePaths = glob.sync(join(packageRoot, '*/src/**/*.ts'));
    for (const path of filePaths) {
      // Look for imports like:
      //   import {foo, bar} from '@diez/baz';
      const basedir = dirname(path);
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
    }

    await project.save();

    run(theme ? `yarn typedoc --theme ${theme}` : 'yarn typedoc');
    run('git checkout packages');
  },
  options: [
    {
      longName: 'theme',
      valueName: 'themeName',
    },
  ],
};
