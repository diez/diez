import {CliCommandProvider} from '@diez/cli-core';

const provider: CliCommandProvider = {
  name: 'extract',
  description: 'Extract from designs into a Diez project.',
  loadAction: () => import('./extract.action'),
  options: [
    {
      longName: 'hot',
      shortName: 'h',
      description: 'Watch local designs for changes',
    },
  ],
};

export = provider;
