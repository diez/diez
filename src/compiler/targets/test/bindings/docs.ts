import {resolve} from 'path';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding = {
  templates: {
    detail: 'ChildComponent.vue',
  },
  assetsBinder: async ({}, {}, {assetBindings}) => {
    assetBindings.set('meow', {contents: 'meow'});
    assetBindings.set('meow-meow', {
      contents: resolve(__dirname, '..', 'assets', 'cat.jpg'),
      copy: true,
    });
  },
};

export = binding;
