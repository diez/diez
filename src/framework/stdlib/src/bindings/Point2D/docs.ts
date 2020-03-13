
import {Point2D} from '@diez/prefabs';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding<Point2D> = {
  templates: {
    detail: 'Point2D/point2d-detail.vue',
    item: 'Point2D/point2d-item.vue',
    icon: 'Point2D/point2d-icon.vue',
  },
};

export = binding;
