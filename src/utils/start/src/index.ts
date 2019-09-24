import {CliCommandProvider} from '@diez/cli-core';

const provider: CliCommandProvider = {
  name: 'start <target> [targetRoot]',
  description: 'Start a Diez example project in hot mode.',
  loadAction: () => import('./index.action'),
};

export = provider;
