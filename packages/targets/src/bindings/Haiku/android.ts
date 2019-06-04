import {File, FileType, Haiku} from '@diez/prefabs';
import {join} from 'path';
import {haikuAssetBinder} from '../../asset-binders/haiku';
import {AndroidBinding} from '../../targets/android.api';
import {portAssetBindingToResource} from '../../targets/android.handler';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Haiku> = {
  sources: [
    join(sourcesPath, 'android', 'bindings', 'File.kt'),
    join(sourcesPath, 'android', 'bindings', 'Haiku.kt'),
  ],
  assetsBinder: async (instance, program, output, spec) => {
    // Do the work of the vector asset binder.
    await haikuAssetBinder(instance, program, output, spec);
    // Resources are not used in hot mode.
    if (program.hot) {
      return;
    }

    portAssetBindingToResource(new File({src: `haiku/${instance.component}.html`}), output, FileType.Raw);
  },
};

export = binding;
