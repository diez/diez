import {CliCommandProvider} from '@diez/cli-core';

const getTargetsLazy = () => import('../utils').then(({getTargets}) => getTargets());

const provider: CliCommandProvider = {
  name: 'compile',
  description: 'Compile a local Diez project.',
  loadAction: () => import('./compile.action'),
  options: [
    {
      shortName: 't',
      longName: 'target',
      valueName: 'target',
      description: 'The target platform for the compiled SDK.',
      validator: async ({target}) => {
        if (!target) {
          throw new Error('--target is required.');
        }

        const targets = await getTargetsLazy();

        if (!targets.has(target.toString().toLowerCase())) {
          let message = `Invalid target: ${target}. The following targets are supported:`;
          for (const [name] of targets) {
            message += `\n - ${name}`;
          }
          throw new Error(message);
        }
      },
    },
    {
      longName: 'sdk-version',
      valueName: 'sdkVersion',
      description: 'The semantic version to set on the generated SDK.',
    },
  ],
};

export = provider;
