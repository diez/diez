import {CliCommandExtension} from '@diez/cli-core';
import {onlyTarget} from '../utils';

const extension: CliCommandExtension = {
  names: ['compile'],
  options: [
    {
      longName: 'js',
      description: 'When --target=web, compiles to JavaScript.',
      validator: async (options) => {
        onlyTarget('js', options, 'web');
      },
    },
    {
      longName: 'css',
      description: 'When --target=web, compiles to CSS.',
      validator: async (options) => {
        onlyTarget('css', options, 'web');
      },
    },
    {
      longName: 'scss',
      description: 'When --target=web, compiles to SCSS.',
      validator: async (options) => {
        onlyTarget('scss', options, 'web');
      },
    },
  ],
};

export = extension;
