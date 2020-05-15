import {File, FileType} from '@diez/prefabs';
import {AndroidBinding} from '@diez/targets';
import {join} from 'path';
import {fileAssetBinder} from '../../asset-binders/file';
import {portAssetBindingToResource, sourcesPath} from '../../utils';

const binding: AndroidBinding<File> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'File.kt')],
  assetsBinder: async (instance, program, output, spec, property) => {
    if (instance.type === FileType.Remote) {
      output.processedComponents.delete(spec.type);
    }
    // Do the work of the file asset binder, mainly to benefit from its validations.
    await fileAssetBinder(instance, program, output, spec, property);
    // Resources are not used in hot mode; images need special handling; remote files are not supported.
    if (program.hot || instance.type === FileType.Image) {
      return;
    }

    portAssetBindingToResource(instance, output, instance.type);
  },
};

export = binding;
