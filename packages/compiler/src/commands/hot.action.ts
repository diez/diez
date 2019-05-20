import {fatalError} from '@diez/cli-core';
import {CompilerEvent, CompilerOptions} from '../api';
import {Program} from '../compiler';
import {getTargets, printWarnings} from '../utils';

/**
 * The entry point for compilation.
 * @ignore
 */
export const hotAction = async (options: CompilerOptions) => {
  options.target = options.target.toLowerCase();
  const targetProvider = (await getTargets()).get(options.target);

  if (!targetProvider) {
    // This should never happen.
    fatalError(`Invalid target: ${options.target}. See --help for options.`);
    return;
  }

  const program = new Program(global.process.cwd(), options, true);
  // Print warnings on every `Compiled` event.
  program.on(CompilerEvent.Compiled, () => {
    printWarnings(program.targetComponents);
  });

  // Start the hot handler on the first `Compiled` event.
  program.once(CompilerEvent.Compiled, () => {
    targetProvider.handler(program);
  });

  program.watch();
};
