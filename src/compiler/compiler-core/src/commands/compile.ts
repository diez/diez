import {CliCommandProvider, Log} from '@diez/cli-core';
import {Target} from '@diez/engine';

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
      validator: async (options) => {
        if (!options.target) {
          options.target = Target.Web;
          Log.warning(`\nWarning: please specify an explicit target using --target or -t. \nDefaulting to --target=${options.target.toString()}\n`);
        }

        const targets = await getTargetsLazy();

        if (!targets.has(options.target.toString().toLowerCase())) {
          let message = `Invalid target: ${options.target}. The following targets are supported:`;
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
