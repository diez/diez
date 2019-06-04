import {fatalError} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {CompilerOptions} from '../api';
import {Program} from '../compiler';
import {getTargets, printWarnings} from '../utils';

export = async (options: CompilerOptions) => {
  options.target = options.target.toLowerCase() as Target;
  const targetProvider = (await getTargets()).get(options.target);

  if (!targetProvider) {
    // This should never happen.
    return fatalError(`Invalid target: ${options.target}. See --help for options.`);
  }

  const program = new Program(global.process.cwd(), options);
  await program.run();

  if (!program.localComponentNames.length) {
    return fatalError('No local components found!');
  }

  printWarnings(program.targetComponents);
  return targetProvider.handler(program);
};
