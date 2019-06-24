import {CliCommandExtension} from '@diez/cli-core';
import {onlyTarget} from '../utils';

const extension: CliCommandExtension = {
  names: ['compile', 'hot'],
  options: [
    {
      longName: 'js',
      description: 'When --target=web, compiles to JavaScript.',
      validator: async (options) => {
        onlyTarget('js', options, 'web');
      },
    },
  ],
};

export = extension;
