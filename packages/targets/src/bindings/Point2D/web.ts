import {Point2D} from '@diez/prefabs';
import {WebBinding} from '../../targets/web.api';
import {joinToKebabCase} from '../../utils';

const binding: WebBinding<Point2D> = {
  // TODO: Remove the need to provide an empty binding on prefabs without any binding overrides.
  // Provide an empty array to prevent this prefab from being treated as a singleton.
  sources: [],
  assetsBinder: async (instance, program, output, spec, property) => {
    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (property.parentType !== 'LinearGradient' && property.parentType !== 'DropShadow') {
      const name = joinToKebabCase(property.parentType, property.name);
      output.styleSheet.variables.set(`${name}-x-px`, `${instance.x}px`);
      output.styleSheet.variables.set(`${name}-x-rem`, `${instance.x}rem`);
      output.styleSheet.variables.set(`${name}-y-px`, `${instance.y}px`);
      output.styleSheet.variables.set(`${name}-y-rem`, `${instance.y}rem`);
    }
  },
};

export = binding;
