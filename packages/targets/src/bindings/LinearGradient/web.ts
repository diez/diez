import {diezVersion} from '@diez/cli-core';
import {LinearGradient} from '@diez/prefabs';
import {linearGradientToCss} from '@diez/web-sdk-common';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {joinToKebabCase, sourcesPath} from '../../utils';

const binding: WebBinding<LinearGradient> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'LinearGradient.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'LinearGradient.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    const value = linearGradientToCss(instance);

    output.styleSheet.styles.insertRule({
      selector: `${name}-background`,
      declaration: {
        background: value,
      },
    });

    output.styleSheet.styles.insertRule({
      selector: `${name}-background-image`,
      declaration: {
        'background-image': value,
      },
    });

    output.styleSheet.variables.set(name, value);
  },
  dependencies: [{
    packageJson: {
      name: '@diez/web-sdk-common',
      versionConstraint: `^${diezVersion}`,
    },
  }],
};

export = binding;
