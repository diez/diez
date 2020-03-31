import {Size2D} from '@diez/prefabs';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding<Size2D> = {
  templates: {
    detail: 'Size2D/size2d-detail.vue',
    item: 'Size2D/size2d-item.vue',
    icon: 'Size2D/size2d-icon.vue',
  },
};

export = binding;
