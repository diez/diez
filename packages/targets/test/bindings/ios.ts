import {join} from 'path';
import {IosBinding} from '../../src/targets/ios.api';

const binding: IosBinding = {
  sources: [join(__dirname, '..', 'sources', 'bindings', 'ChildComponent+Binding.swift')],
  dependencies: [{
    cocoapods: {
      name: 'meow',
      versionConstraint: '~> 10.10.10',
    },
    carthage: {
      name: 'Meow',
      github: 'smileforce/meow',
      versionConstraint: '~> 10.10.10',
    },
  }],
  assetsBinder: async ({}, {}, {assetBindings}) => {
    assetBindings.set(
      'meow',
      {
        contents: 'meow',
      },
    );
  },
};

export = binding;
