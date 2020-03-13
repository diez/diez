import {Color} from '@diez/prefabs';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding<Color> = {
  templates: {
    detail: 'Color/color-detail.vue',
    item: 'Color/color-item.vue',
    icon: 'Color/color-icon.vue',
  },
};

export = binding;
