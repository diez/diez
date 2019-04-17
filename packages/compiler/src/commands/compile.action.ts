/* tslint:disable:max-line-length */
import {fatalError, info} from '@diez/cli';
import {join, resolve} from 'path';
import {getTargets, getValidProgram, printWarnings, processType} from '../utils';

interface CompileOptions {
  output: string;
  target: string;
  dev: boolean;
}

/**
 * The entry point for compilation.
 */
export const compileAction = async ({output, target: targetIn, dev}: CompileOptions) => {
  const target = targetIn.toLowerCase();
  const targets = await getTargets();
  if (!targets.has(target)) {
    fatalError(`Invalid target: ${target}. Valid targets are: ${Array.from(targets.keys()).join(', ')}.`);
  }

  const targetHandler = targets.get(target)!;

  const program = await getValidProgram(global.process.cwd(), resolve(output), dev);

  const sourceFile = program.project.getSourceFileOrThrow(join('src', 'index.ts'));
  info(`Unwrapping component types from ${resolve(program.projectRoot, 'src', 'index.ts')}...`);
  for (const exportDeclaration of sourceFile.getExportDeclarations()) {
    for (const exportSpecifier of exportDeclaration.getNamedExports()) {
      const moduleName = exportDeclaration.getModuleSpecifierValue()!;
      if (!moduleName.startsWith('.')) {
        continue;
      }

      const type = program.checker.getTypeAtLocation(exportSpecifier);
      if (processType(type, program)) {
        program.localComponentNames.push(exportSpecifier.getName());
      }
    }
  }

  if (!program.localComponentNames.length) {
    fatalError('No local components found!');
  }

  printWarnings(program.targetComponents);
  await targetHandler(program);
};
