import {File} from '@diez/prefabs';
import {join} from 'path';
import {fileAssetBinder} from '../../asset-binders/file';
import {WebBinding} from '../../targets/web.api';
import {sourcesPath} from '../../utils';

const binding: WebBinding<File> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'File.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'File.d.ts')],
  assetsBinder: fileAssetBinder,
};

export = binding;
