import {File, FileType} from '@diez/prefabs';
import {join} from 'path';
import {fileAssetBinder} from '../../asset-binders/file';
import {AndroidBinding} from '../../targets/android.api';
import {portAssetBindingToResource} from '../../targets/android.handler';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<File> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'File.kt')],
  assetsBinder: async (instance, program, output, spec) => {
    // Do the work of the file asset binder, mainly to benefit from its validations.
    await fileAssetBinder(instance, program, output, spec);
    // Resources are not used in hot mode; images need special handling.
    if (program.hot || instance.type === FileType.Image) {
      return;
    }

    portAssetBindingToResource(instance, output, instance.type);
  },
};

export = binding;
