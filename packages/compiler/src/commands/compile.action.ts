/* tslint:disable:max-line-length */
import {fatalError, findOpenPort, getCandidatePortRange, info} from '@livedesigner/cli';
import {join, resolve} from 'path';
import {ClassDeclaration} from 'ts-morph';
import {NamedComponentMap} from '../api';
import {serveHot} from '../server';
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
    `import {Component} from '@livedesigner/engine';`,
  );

  const sourceFile = project.getSourceFileOrThrow(join('src', 'index.ts'));

  const checker = project.getTypeChecker();
  const engineImports = stubTypeFile.getImportDeclarationOrThrow('@livedesigner/engine').getNamedImports();
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

  if (dev) {
    const devPort = await findOpenPort(getCandidatePortRange(8080, 100));
    await serveHot(projectRoot, devPort);
    await targetHandler(projectRoot, resolve(output), foundComponents, targetComponents, true, devPort);
    // TODO: watch for hot updates and update the SDK when things change.
    // TODO: when we shut down, compile once in prod mode.
  } else {
    await targetHandler(projectRoot, resolve(output), foundComponents, targetComponents, false);
  }

  printWarnings(targetComponents);
};
