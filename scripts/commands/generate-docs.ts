import chalk from 'chalk';
import {Stats} from 'fs-extra';
import {walkSync} from 'fs-walk';
import {extname, join, relative, sep} from 'path';
import {Project} from 'ts-morph';
import {root, run} from '../internal/helpers';

const packageRoot = join(root, 'packages');

/**
 * Generates docs. We need to rewrite cross-linked imports in order to have them link correctly in the monorepo.
 */
export const generateDocs = async () => {
  const gitChanges = run('git diff packages', root, 'pipe');
  if (gitChanges && gitChanges.toString()) {
    console.log(chalk.red('Found untracked Git changes in packages/. Stash them before generating docs.'));
    process.exit(1);
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
    sourceFile.getImportDeclarations().forEach((declaration) => {
      if (!declaration.getModuleSpecifierValue().startsWith('@diez/')) {
        return;
      }

      // Rewrite the first import path component as the relative location so typedoc can resolve it.
      // Rewrite the third (which might not exist) to resolve source files specifically.
      const importPathComponents = declaration.getModuleSpecifierValue().split('/');
      importPathComponents[0] = relative(basedir, packageRoot);
      importPathComponents[2] = 'src';

      declaration.setModuleSpecifier(importPathComponents.join('/'));
    });
  });

  await project.save();

  run('yarn typedoc');
  run('git checkout packages');
};
