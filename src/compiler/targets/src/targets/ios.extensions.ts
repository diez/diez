import {CliCommandExtension} from '@diez/cli-core';
import {onlyTarget} from '../utils';

const extension: CliCommandExtension = {
  names: ['compile'],
  options: [
    {
      longName: 'cocoapods',
      description: 'When --target=ios, creates a Podspec.',
      validator: async (options) => {
        onlyTarget('cocoapods', options, 'ios');
      },
    },
    {
      longName: 'carthage',
      description: 'When --target=ios, creates a Cartfile and initializes a Git repository.',
      validator: async (options) => {
        onlyTarget('carthage', options, 'ios');
      },
    },
  ],
};

export = extension;
