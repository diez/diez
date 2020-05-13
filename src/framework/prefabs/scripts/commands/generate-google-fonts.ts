import {CliCommandProvider} from '@diez/cli-core';

const provider: CliCommandProvider = {
  name: 'generate-google-fonts',
  description: 'TODO',
  loadAction: () => import('./generate-google-fonts.action'),
  options: [
    {
      description: 'TODO',
      longName: 'apiKey',
      valueName: 'apiKey',
      validator: async (options) => {
        if (!options.apiKey) {
          throw new Error('apiKey is required.');
        }
      },
    },
  ],
};

export = provider;
