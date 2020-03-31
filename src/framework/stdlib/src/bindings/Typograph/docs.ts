import {Typograph} from '@diez/prefabs';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding<Typograph> = {
  templates: {
    detail: 'Typograph/typograph-detail.vue',
    item: 'Typograph/typograph-item.vue',
    icon: 'Typograph/typograph-icon.vue',
  },
};

export = binding;
