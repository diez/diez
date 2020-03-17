import {CliCommandProvider} from '../api';

const provider: CliCommandProvider = {
  name: 'update',
  description: 'Update Diez packages in the current project.',
  loadAction: () => import('./update.action'),
  options: [
    {
      longName: 'to-version',
      valueName: 'requestedVersion',
      description: 'Update Diez to the provided version.',
    },
  ],
};

export = provider;
