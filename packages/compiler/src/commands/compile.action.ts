/* tslint:disable:max-line-length */
import {fatalError} from '@diez/cli';
import {resolve} from 'path';
import {Program} from '../compiler';
import {getTargets, printWarnings} from '../utils';

interface CompileOptions {
  output: string;
  target: string;
  dev: boolean;
}

/**
 * The entry point for compilation.
 * @ignore
 */
export const compileAction = async ({output, target: targetIn, dev}: CompileOptions) => {
  const target = targetIn.toLowerCase();
  const targets = await getTargets();
  if (!targets.has(target)) {
    fatalError(`Invalid target: ${target}. Valid targets are: ${Array.from(targets.keys()).join(', ')}.`);
  }

  const targetHandler = targets.get(target)!;

  const program = new Program(global.process.cwd(), resolve(output), target, dev);
  if (!program.localComponentNames.length) {
    fatalError('No local components found!');
  }

  printWarnings(program.targetComponents);
  await targetHandler(program);
};
