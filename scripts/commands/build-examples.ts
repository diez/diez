/* tslint:disable:max-line-length */
import {Log} from '@diez/cli-core';
import glob from 'glob';
import {basename, join, resolve} from 'path';
import {root, runAsync} from '../internal/helpers';

interface Flags {
  target: 'ios' | 'android' | 'web';
}

const getGlobMatches = async (pattern: string) => new Promise<string[]>((resolveMatches) => glob(
  pattern, (_, matches) => resolveMatches(matches)));

export = {
  name: 'build-examples',
  description: 'Builds example projects.',
  options: [{
    shortName: 't',
    longName: 'target',
    valueName: 'target',
    description: 'The name of the compiler target.',
  }],
  loadAction: () => async ({target}: Flags) => {
    if (!target) {
      throw new Error('--target is required.');
    }

    const buildScripts = await getGlobMatches(join(root, 'examples', '*', 'design-language', 'scripts', `build-${target}-ci.sh`));
    for (const buildScript of buildScripts) {
      const exampleRoot = resolve(buildScript, '..', '..', '..');
      const designLanguageRoot = join(buildScript, '..');
      Log.info(`Building for ${target}: ${basename(exampleRoot)}`);
      await runAsync(buildScript, designLanguageRoot);
    }
  },
};
