import {join} from 'path';
import {WebBinding} from '../../src/targets/web.api';

const binding: WebBinding = {
  sources: [join(__dirname, '..', 'sources', 'bindings', 'ChildComponent.js')],
  declarations: [join(__dirname, '..', 'sources', 'bindings', 'ChildComponent.d.ts')],
  dependencies: [{
    packageJson: {
      name: 'meow',
      versionConstraint: '^10.10.10',
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
