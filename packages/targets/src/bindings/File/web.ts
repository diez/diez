import {File} from '@diez/prefabs';
import {join} from 'path';
import {fileAssetBinder} from '../../asset-binders/file';
import {WebBinding} from '../../targets/web.api';
import {joinToKebabCase, sourcesPath} from '../../utils';

const binding: WebBinding<File> = {
  sources: [join(sourcesPath, 'web', 'js', 'bindings', 'File.js')],
  declarations: [join(sourcesPath, 'web', 'js', 'bindings', 'File.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    await fileAssetBinder(instance, program, output, spec, property);

    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (property.parentType !== 'Lottie' && property.parentType !== 'Image') {
      const name = joinToKebabCase(property.parentType, property.name);
      output.styles.variables.set(name, `url("./${output.staticFolder}/${instance.src}")`);
    }
  },
};

export = binding;
