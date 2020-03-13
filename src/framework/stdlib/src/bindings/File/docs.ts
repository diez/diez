import {File} from '@diez/prefabs';
import {fileAssetBinder as assetsBinder} from '../../asset-binders/file';
import {DocsBinding} from '@diez/targets';

const binding: DocsBinding<File> = {
  assetsBinder,
  templates: {
    detail: 'File/file-detail.vue',
    item: 'File/file-item.vue',
    icon: 'File/file-icon.vue',
  },
};

export = binding;
