import {File} from '@diez/designsystem';
import {join} from 'path';
import {fileAssetBinder} from '../../asset-binders/file';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<File> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'File.kt')],
  assetsBinder: fileAssetBinder,
};

export = binding;
