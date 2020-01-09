import {Log} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {valid} from 'semver';
import {CompilerOptions} from '../api';
import {ProjectParser} from '../parser';
import {getProjectRoot, getTargets, inferProjectVersion, printWarnings} from '../utils';

export = async (options: CompilerOptions) => {
  options.target = options.target.toLowerCase() as Target;
  const validSemver = valid(options.sdkVersion);
  const projectRoot = await getProjectRoot();
  if (validSemver) {
    options.sdkVersion = validSemver;
  } else {
    if (options.sdkVersion !== undefined) {
      Log.warning(`Invalid SDK version: ${options.sdkVersion}.`);
    }

    options.sdkVersion = inferProjectVersion(projectRoot);
  }

  const targetProvider = (await getTargets()).get(options.target);

  if (!targetProvider) {
    // This should never happen.
    throw new Error(`Invalid target: ${options.target}. See --help for options.`);
  }

  const program = new ProjectParser(projectRoot, options);
  await program.run();

  if (!program.rootComponentNames.size) {
    throw new Error('No root components found!');
  }

  printWarnings(program.components);
  return targetProvider.handler(program);
};
