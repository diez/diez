import {CliCommandProvider, fatalError} from '@livedesigner/cli';
import {compileAction as action} from './compile.action';

const provider: CliCommandProvider = {
  action,
  name: 'compile',
  description: 'Compile a local Diez project.',
  options: [
    {
      shortName: 't',
      longName: 'target',
      valueName: 'targetName',
      description: 'The name of the compiler target.',
      validator: (value) => {
        if (!value) {
          fatalError('--target is a required flag.');
        }
      },
    },
    {
      shortName: 'o',
      longName: 'output',
      valueName: 'pathToCodebase',
      description: 'The path to your target codebase.',
      validator: (value) => {
        if (!value) {
          fatalError('--output is a required flag.');
        }
      },
    },
    {
      shortName: 'd',
      longName: 'dev',
      description: 'If set, runs the compiler in dev mode.',
    },
  ],
};

export = provider;
