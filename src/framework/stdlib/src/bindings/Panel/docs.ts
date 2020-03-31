import {Panel} from '@diez/prefabs';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding<Panel> = {
  templates: {
    detail: 'Panel/panel-detail.vue',
    item: 'Panel/panel-item.vue',
    icon: 'Panel/panel-icon.vue',
  },
};

export = binding;
