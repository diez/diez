import {LinearGradient} from '@diez/prefabs';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding<LinearGradient> = {
  templates: {
    detail: 'LinearGradient/linear-gradient-detail.vue',
    item: 'LinearGradient/linear-gradient-item.vue',
    icon: 'LinearGradient/linear-gradient-icon.vue',
  },
};

export = binding;
