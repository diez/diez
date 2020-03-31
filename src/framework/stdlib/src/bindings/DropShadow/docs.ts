import {DropShadow} from '@diez/prefabs';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding<DropShadow> = {
  templates: {
    detail: 'DropShadow/drop-shadow-detail.vue',
    item: 'DropShadow/drop-shadow-item.vue',
    icon: 'DropShadow/drop-shadow-icon.vue',
  },
};

export = binding;
