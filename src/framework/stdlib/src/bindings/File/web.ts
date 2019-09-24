import {File, FileType} from '@diez/prefabs';
import {joinToKebabCase, WebBinding} from '@diez/targets';
import {join} from 'path';
import {fileAssetBinder} from '../../asset-binders/file';
import {getQualifiedCssUrl, sourcesPath} from '../../utils';

const binding: WebBinding<File> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'File.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'File.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    await fileAssetBinder(instance, program, output, spec, property);

    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (instance.type === FileType.Raw && property.parentType !== 'Lottie') {
      const name = joinToKebabCase(property.parentType, property.name);
      output.styleSheet.variables.set(name, getQualifiedCssUrl(output, instance.src));
    }
  },
};

export = binding;
