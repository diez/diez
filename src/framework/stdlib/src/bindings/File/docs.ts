import {File} from '@diez/prefabs';
import {DocsBinding} from '@diez/targets';
import {fileAssetBinder as assetsBinder} from '../../asset-binders/file';

const binding: DocsBinding<File> = {
  assetsBinder,
  templates: {
    detail: 'File/file-detail.vue',
    item: 'File/file-item.vue',
    icon: 'File/file-icon.vue',
  },
};

export = binding;
