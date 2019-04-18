import {encodeFileSource, File} from '@diez/designsystem';
import {join} from 'path';
import {fileAssetBinder} from '../../asset-binders/file';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<File> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'File.kt')],
  imports: [
    'android.net.Uri',
    'java.net.URL  ',
  ],
  initializer: (instance) => `File("${encodeFileSource(instance.src)}")`,
  assetsBinder: fileAssetBinder,
};

export = binding;
