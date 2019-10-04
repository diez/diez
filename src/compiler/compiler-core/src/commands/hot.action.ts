import {CliAction} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {CompilerEvent, CompilerOptions} from '../api';
import {ProjectParser} from '../parser';
import {getProjectRoot, getTargets, printWarnings} from '../utils';

const action: CliAction = (options: CompilerOptions) => new Promise(async (resolve, reject) => {
  options.target = options.target.toLowerCase() as Target;
  const targetProvider = (await getTargets()).get(options.target);

  if (!targetProvider) {
    // This should never happen.
    throw new Error(`Invalid target: ${options.target}. See --help for options.`);
  }

  const program = new ProjectParser(await getProjectRoot(), options, true);
  // Print warnings on every `Compiled` event.
  program.on(CompilerEvent.Compiled, () => printWarnings(program.components));

  // Start the hot handler on the first `Compiled` event.
  program.once(CompilerEvent.Compiled, () => {
    targetProvider.handler(program).catch(reject).then(resolve);
  });

  program.watch();
});

export = action;
