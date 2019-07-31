import {diezVersion} from '@diez/cli-core';
import {DropShadow} from '@diez/prefabs';
import {dropShadowToCss, dropShadowToFilterCss} from '@diez/web-sdk-common';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {joinToKebabCase, sourcesPath} from '../../utils';

const binding: WebBinding<DropShadow> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'DropShadow.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'DropShadow.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    const value = dropShadowToCss(instance);
    const filterValue = dropShadowToFilterCss(instance);

    output.styleSheet.styles.insertRule({
      selector: `${name}-box-shadow`,
      declaration: {
        'box-shadow': value,
      },
    });

    output.styleSheet.styles.insertRule({
      selector: `${name}-text-shadow`,
      declaration: {
        'text-shadow': value,
      },
    });

    output.styleSheet.styles.insertRule({
      selector: `${name}-filter`,
      declaration: {
        filter: filterValue,
      },
    });

    output.styleSheet.variables.set(name, value);
    output.styleSheet.variables.set(`${name}-filter`, filterValue);
  },
  dependencies: [{
    packageJson: {
      name: '@diez/web-sdk-common',
      versionConstraint: `^${diezVersion}`,
    },
  }],
};

export = binding;
