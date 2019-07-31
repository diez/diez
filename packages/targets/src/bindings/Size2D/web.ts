import {Size2D} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {joinToKebabCase, sourcesPath} from '../../utils';

const binding: WebBinding<Size2D> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Size2D.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Size2D.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (property.parentType !== 'Image') {
      const name = joinToKebabCase(property.parentType, property.name);
      output.styleSheet.variables.set(`${name}-width-px`, `${instance.width}px`);
      output.styleSheet.variables.set(`${name}-width-rem`, `${instance.width}rem`);
      output.styleSheet.variables.set(`${name}-height-px`, `${instance.height}px`);
      output.styleSheet.variables.set(`${name}-height-rem`, `${instance.height}rem`);
    }
  },
};

export = binding;
