import {CliCommandProvider} from '@diez/cli-core';

const provider: CliCommandProvider = {
  name: 'create [projectName]',
  description: 'Creates a Diez project.',
  loadAction: () => import('./create.action'),
  options: [
    {
      longName: 'bare',
      description: 'Scaffold an empty Diez project without any example app codebases.',
    },
  ],
};

export = provider;
