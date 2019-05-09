import {CliCommandExtension} from '@diez/cli-core';
import {onlyTarget} from '../utils';

const extension: CliCommandExtension = {
  name: 'compile',
  options: [
    {
      longName: 'baseUrl',
      valueName: 'baseUrl',
      description: 'When --target=web, specifies the base URL Diez static assets should serve from.',
      validator: async (options) => {
        onlyTarget('baseUrl', options, 'web');
      },
    },
    {
      longName: 'staticRoot',
      valueName: 'staticRoot',
      description: 'When --target=web, specifies the location Diez should move static assets to.',
      validator: async (options) => {
        onlyTarget('staticRoot', options, 'web');
      },
    },
  ],
};

export = extension;
