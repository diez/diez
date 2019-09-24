import glob from 'glob';
import {dirname, join, relative, resolve} from 'path';
import {Project} from 'ts-morph';
import {assertNotWatching, root, run, runQuiet} from '../internal/helpers';

interface GenerateDocsOptions {
  theme: string;
}

export = {
  name: 'generate-docs',
  description: 'Generates docs.',
  loadAction: () => async ({theme}: GenerateDocsOptions) => {
    assertNotWatching();
    const gitChanges = runQuiet('git diff src');
    if (gitChanges) {
      throw new Error('Found untracked Git changes in src/. Stash them before generating docs.');
    }

    const project = new Project();

    const filePaths = glob.sync(join(root, 'src/*/*/src/**/*.ts'));
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
        const diezImport = `${importPathComponents.shift()}/${importPathComponents.shift()}`;
        const diezImportLocation = resolve(require.resolve(diezImport), '..', '..');
        importPathComponents.unshift('src');
        importPathComponents.unshift(relative(basedir, diezImportLocation));

        declaration.setModuleSpecifier(importPathComponents.join('/'));
      }

      for (const namespace of sourceFile.getNamespaces()) {
        if (!namespace.getName().startsWith("'@diez/")) {
          continue;
        }

        const namespacePathComponents = namespace.getName().replace(/'/g, '').replace('types', 'src').split('/');
        const diezImport = `${namespacePathComponents.shift()}/${namespacePathComponents.shift()}`;
        const diezImportLocation = resolve(require.resolve(diezImport), '..', '..');
        namespacePathComponents.unshift(relative(basedir, diezImportLocation));
        namespace.getNameNodes()[0].replaceWithText(`'${namespacePathComponents.join('/')}'`);
      }
    }

    await project.save();

    run(theme ? `yarn typedoc --theme ${theme}` : 'yarn typedoc');
    run('git checkout src');
  },
  options: [
    {
      longName: 'theme',
      valueName: 'themeName',
    },
  ],
};
