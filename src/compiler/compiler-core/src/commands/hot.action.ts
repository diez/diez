import {CliAction} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {prompt} from 'enquirer';
import {removeSync} from 'fs-extra';
import {CompilerEvent, CompilerOptions, CompilerProvider} from '../api';
import {ProjectParser} from '../parser';
import {ExistingHotUrlMutexError, getProjectRoot, getTargets, printWarnings, projectCache} from '../utils';

interface Answers {
  removeMutex: boolean;
}

const askToRemoveHotUrl = async () => {
  const questions: any[] = [];
  questions.push({
    type: 'confirm',
    name: 'removeMutex',
    required: true,
    message: 'We found another hot process running, do you want to take over?.',
  });

  return await prompt<Answers>(questions);
};

const runProgram = async (options: CompilerOptions, targetProvider: CompilerProvider) =>
  new Promise(async (resolve, reject) => {
    const program = new ProjectParser(await getProjectRoot(), options, true);
    // Print warnings on every `Compiled` event.
    program.on(CompilerEvent.Compiled, () => printWarnings(program.components));

    // Start the hot handler on the first `Compiled` event.
    program.once(CompilerEvent.Compiled, () => {
      targetProvider
        .handler(program)
        .catch(async (error) => {
          if (!(error instanceof ExistingHotUrlMutexError)) {
            return reject(error);
          }

          const {removeMutex} = await askToRemoveHotUrl();
          if (!removeMutex) {
            process.exit(0);
          }
          removeSync(error.mutexPath);
          program.close();
          projectCache.clear();
          runProgram(options, targetProvider);

        })
        .then(resolve);
    });

    program.watch();
  });

const action: CliAction = async (options: CompilerOptions) => {
  options.target = options.target.toLowerCase() as Target;
  const targetProvider = (await getTargets()).get(options.target);

  if (!targetProvider) {
    // This should never happen.
    throw new Error(`Invalid target: ${options.target}. See --help for options.`);
  }

  await runProgram(options, targetProvider);
};

export = action;
