import {CliCommandProvider} from '@diez/cli-core';

const provider: CliCommandProvider = {
  name: 'create [projectName]',
  description: 'Creates a Diez project.',
  loadAction: () => import('./create.action'),
};

export = provider;
