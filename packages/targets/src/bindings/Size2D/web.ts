import {Size2D} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {joinToKebabCase, sourcesPath, updateStyleSheetWithUnitedVariables} from '../../utils';

const binding: WebBinding<Size2D> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Size2D.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Size2D.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (property.parentType !== 'Image') {
      const baseName = joinToKebabCase(property.parentType, property.name);

      updateStyleSheetWithUnitedVariables(`${baseName}-width`, `${instance.width}`, output.styleSheet);
      updateStyleSheetWithUnitedVariables(`${baseName}-height`, `${instance.height}`, output.styleSheet);
    }
  },
};

export = binding;
