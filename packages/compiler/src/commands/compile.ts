import {CliCommandProvider, fatalError} from '@diez/cli-core';
import {getTargets} from '../utils';
import {compileAction as action} from './compile.action';

const provider: CliCommandProvider = {
  action,
  name: 'compile',
  description: 'Compile a local Diez project.',
  options: [
    {
      shortName: 't',
      longName: 'target',
      valueName: 'target',
      validator: async ({target}) => {
        if (!target) {
          fatalError('--target is required.');
        }

        const targets = await getTargets();

        if (!targets.has(target.toString().toLowerCase())) {
          fatalError(`Invalid target: ${target}. See --help for options.`);
        }
      },
    },
    {
      shortName: 'o',
      longName: 'outputPath',
      valueName: '/path/to/codebase',
      description: 'The path to your target codebase.',
      validator: async ({outputPath}) => {
        if (!outputPath) {
          fatalError('--outputPath is a required flag.');
        }
      },
    },
    {
      shortName: 'd',
      longName: 'devMode',
      description: 'If set, runs the compiler in dev mode.',
    },
  ],
  preinstall: async () => {
    const targets = await getTargets();
    const targetOption = provider.options![0];
    const indentation = `${' '.repeat(40)} - `;
    targetOption.description = 'The following targets are supported: ';
    for (const [name] of targets) {
      targetOption.description += `\n${indentation}${name}`;
    }
  },
};

export = provider;
