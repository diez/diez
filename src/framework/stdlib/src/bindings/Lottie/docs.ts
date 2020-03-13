import {Lottie} from '@diez/prefabs';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding<Lottie> = {
  templates: {
    detail: 'Lottie/lottie-detail.vue',
    item: 'Lottie/lottie-item.vue',
    icon: 'Lottie/lottie-icon.vue',
  },
};

export = binding;
