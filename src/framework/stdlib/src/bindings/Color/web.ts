import {diezVersion} from '@diez/cli-core';
import {Color} from '@diez/prefabs';
import {joinToKebabCase, WebBinding} from '@diez/targets';
import {colorToCss} from '@diez/web-sdk-common';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: WebBinding<Color> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Color.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Color.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (
      property.parentType === 'DropShadow' ||
      property.parentType === 'GradientStop' ||
      property.parentType === 'Fill' ||
      property.parentType === 'Panel' ||
      property.parentType === 'Typograph'
    ) {
      return;
    }

    const name = joinToKebabCase(property.parentType, property.name);
    const value = colorToCss(instance);

    output.styleSheet.styles.insertRule({
      selector: `${name}-background-color`,
      declaration: {
        'background-color': value,
      },
    });

    output.styleSheet.styles.insertRule({
      selector: `${name}-color`,
      declaration: {
        color: value,
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
