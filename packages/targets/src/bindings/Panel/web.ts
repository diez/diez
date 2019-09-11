import {Panel} from '@diez/prefabs';
import {dropShadowToCss, fillToBackgroundCss} from '@diez/web-sdk-common';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {joinToKebabCase, sourcesPath} from '../../utils';

const binding: WebBinding<Panel> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Panel.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Panel.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);

    output.styleSheet.styles.insertRule({
      selector: name,
      declaration: {
        'box-shadow': dropShadowToCss(instance.dropShadow),
        'border-radius': `${instance.cornerRadius}px`,
        background: fillToBackgroundCss(instance.background),
      },
    });
  },
};

export = binding;
