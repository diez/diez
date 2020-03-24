import {Fill} from '@diez/prefabs';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding<Fill> = {
  templates: {
    detail: 'Fill/fill-detail.vue',
    item: 'Fill/fill-item.vue',
    icon: 'Fill/fill-icon.vue',
  },
};

export = binding;
