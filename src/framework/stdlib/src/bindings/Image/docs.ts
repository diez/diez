import {Image} from '@diez/prefabs';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding<Image> = {
  templates: {
    detail: 'Image/image-detail.vue',
    item: 'Image/image-item.vue',
    icon: 'Image/image-icon.vue',
  },
};

export = binding;
