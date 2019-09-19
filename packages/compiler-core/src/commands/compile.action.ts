import {Log} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {valid} from 'semver';
import {CompilerOptions} from '../api';
import {ProjectParser} from '../compiler';
import {getProjectRoot, getTargets, printWarnings} from '../utils';

export = async (options: CompilerOptions) => {
  options.target = options.target.toLowerCase() as Target;
  const validSemver = valid(options.sdkVersion);
  if (validSemver) {
    options.sdkVersion = validSemver;
  } else {
    if (options.sdkVersion !== undefined) {
      Log.warning(`Invalid SDK version: ${options.sdkVersion}.`);
    }
    options.sdkVersion = '0.1.0';
  }

  const targetProvider = (await getTargets()).get(options.target);

  if (!targetProvider) {
    // This should never happen.
    throw new Error(`Invalid target: ${options.target}. See --help for options.`);
  }

  const program = new ProjectParser(await getProjectRoot(), options);
  await program.run();

  if (!program.localComponentNames.size) {
    throw new Error('No local components found!');
  }

  printWarnings(program.targetComponents);
  return targetProvider.handler(program);
};
