/* tslint:disable:max-line-length */
import {fatalError} from '@diez/cli-core';
import {resolve} from 'path';
import {CompilerOptions} from '../api';
import {Program} from '../compiler';
import {getTargets, printWarnings} from '../utils';

/**
 * The entry point for compilation.
 * @ignore
 */
export const compileAction = async (options: CompilerOptions) => {
  options.target = options.target.toLowerCase();
  const targetProvider = (await getTargets()).get(options.target);

  if (!targetProvider) {
    // This should never happen.
    return fatalError(`Invalid target: ${options.target}. See --help for options.`);
  }

  options.outputPath = resolve(options.outputPath);

  const program = new Program(global.process.cwd(), options);
  if (!program.localComponentNames.length) {
    return fatalError('No local components found!');
  }

  printWarnings(program.targetComponents);
  return await targetProvider.handler(program);
};
