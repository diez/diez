import {CliCommandProvider} from '@diez/cli-core';

const provider: CliCommandProvider = {
  name: 'generate-google-fonts',
  description: 'Generates a collection of Font prefab instances with all available Google Fonts.',
  loadAction: () => import('./generate-google-fonts.action'),
  options: [
    {
      description: 'Your Google Developer API key (required)',
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
