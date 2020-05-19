import {CliCommandProvider} from '@diez/cli-core';

const provider: CliCommandProvider = {
  name: 'start <target>',
  description: 'Start a Diez example project in hot mode.',
  loadAction: () => import('./index.action'),
  options: [
    {
      longName: 'targetRoot',
      description: 'path to the location of the project consuming the design language.',
      valueName: 'path',
    },
  ],
};

export = provider;
