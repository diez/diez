import {CliCommandExtension, fatalError, warning} from '@diez/cli-core';

const extension: CliCommandExtension = {
  name: 'compile',
  options: [
    {
      longName: 'baseUrl',
      valueName: 'baseUrl',
      description: 'When --target=web, specifies the base URL Diez static assets should serve from.',
      validator: async ({target, devMode, baseUrl}) => {
        if (target !== 'web') {
          if (baseUrl) {
            warning('--baseUrl is meaningless unless --target=web.');
          }

          return;
        }

        if (!devMode && !baseUrl) {
          fatalError('--baseUrl is required when --devMode is disabled and --target=web.');
        }
      },
    },
    {
      longName: 'staticRoot',
      valueName: 'staticRoot',
      description: 'When --target=web, specifies the location Diez should move static assets to.',
      validator: async ({target, devMode, staticRoot}) => {
        if (target !== 'web') {
          if (staticRoot) {
            warning('--staticRoot is meaningless unless --target=web.');
          }

          return;
        }

        if (!devMode && !staticRoot) {
          fatalError('--staticRoot is required when --devMode is disabled and --target=web.');
        }
      },
    },
  ],
};

export = extension;
