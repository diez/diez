import {CliCommandProvider, fatalError} from '@diez/cli-core';

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
      validator: async ({target}) => {
        if (!target) {
          fatalError('--target is required.');
        }

        const targets = await getTargetsLazy();

        if (!targets.has(target.toString().toLowerCase())) {
          let message = `Invalid target: ${target}. The following targets are supported:`;
          for (const [name] of targets) {
            message += `\n - ${name}`;
          }
          fatalError(message);
        }
      },
    },
  ],
};

export = provider;
