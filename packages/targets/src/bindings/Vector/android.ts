import {File, FileType, Vector} from '@diez/prefabs';
import {join} from 'path';
import {vectorAssetBinder} from '../../asset-binders/vector';
import {AndroidBinding} from '../../targets/android.api';
import {portAssetBindingToResource} from '../../targets/android.handler';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Vector> = {
  sources: [
    join(sourcesPath, 'android', 'bindings', 'File.kt'),
    join(sourcesPath, 'android', 'bindings', 'Vector.kt'),
  ],
  assetsBinder: async (instance, program, output, spec) => {
    // Do the work of the vector asset binder.
    await vectorAssetBinder(instance, program, output, spec);
    // Resources are not used in hot mode.
    if (program.hot) {
      return;
    }

    portAssetBindingToResource(new File({src: `${instance.src}.html`}), output, FileType.Raw);
  },
};

export = binding;
