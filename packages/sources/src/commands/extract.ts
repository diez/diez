import {CliCommandProvider} from '@diez/cli-core';
import {syncAction as action} from './extract.action';

const provider: CliCommandProvider = {
  action,
  name: 'extract',
  description: 'Extract from designs into a Diez project.',
  options: [
    {
      longName: 'hot',
      shortName: 'h',
      description: 'Watch local designs for changes',
    },
  ],
};

export = provider;
