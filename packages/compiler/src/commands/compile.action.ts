/* tslint:disable:max-line-length */
import {fatalError, info} from '@diez/cli';
import {join, resolve} from 'path';
import {ClassDeclaration} from 'ts-morph';
import {NamedComponentMap} from '../api';
import {getTargets, getValidProject, printWarnings, processType, runPackageScript, shouldUseYarn} from '../utils';

interface CompileOptions {
  output: string;
  target: string;
  dev: boolean;
}

/**
 * The entry point for compilation.
 */
export const compileAction = async ({output, target, dev}: CompileOptions) => {
  const targets = await getTargets();
  const validTargets = Array.from(targets.keys());
  if (!validTargets.includes(target)) {
    fatalError(`Invalid target: ${target}. Valid targets are: ${validTargets.join(', ')}.`);
  }

  const targetHandler = targets.get(target)!;

  const projectRoot = global.process.cwd();
  const targetComponents: NamedComponentMap = new Map();

  info(`Validating project structure at ${projectRoot}...`);
  const project = getValidProject(projectRoot);
  const useYarn = await shouldUseYarn();
  info('Compiling TypeScript sources...');
  const compilationSucceeded = await runPackageScript('tsc', useYarn, projectRoot);
  if (!compilationSucceeded) {
    fatalError('Unable to compile project.');
  }

  // Create a stub type file for typing the class
  const stubTypeFile = project.createSourceFile(
    'src/__stub.ts',
    "import {Component} from '@diez/engine';",
  );

  const sourceFile = project.getSourceFileOrThrow(join('src', 'index.ts'));

  const checker = project.getTypeChecker();
  const engineImports = stubTypeFile.getImportDeclarationOrThrow('@diez/engine').getNamedImports();
  const componentDeclaration = checker.getTypeAtLocation(engineImports[0]).getSymbolOrThrow().getValueDeclarationOrThrow() as ClassDeclaration;
  info(`Unwrapping component types from ${resolve(projectRoot, 'src', 'index.ts')}...`);
  const foundComponents: string[] = [];
  for (const exportDeclaration of sourceFile.getExportDeclarations()) {
    for (const exportSpecifier of exportDeclaration.getNamedExports()) {
      const moduleName = exportDeclaration.getModuleSpecifierValue()!;
      if (!moduleName.startsWith('.')) {
        continue;
      }

      const type = checker.getTypeAtLocation(exportSpecifier);
      if (processType(checker, type, componentDeclaration, targetComponents)) {
        foundComponents.push(exportSpecifier.getName());
      }
    }
  }

  if (!foundComponents.length) {
    fatalError('No components found!');
  }

  printWarnings(targetComponents);
  await targetHandler(projectRoot, resolve(output), foundComponents, targetComponents, dev);
};
