import {diezVersion} from '@diez/cli-core';
import {MediaQuery} from '@diez/prefabs';
import {joinToKebabCase, WebBinding} from '@diez/targets';
import {queriesToCss} from '@diez/web-sdk-common';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: WebBinding<MediaQuery> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'MediaQuery.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'MediaQuery.d.ts')],
  examples: [],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    output.styleSheet.mediaQueries.set(name, queriesToCss(instance));
  },
  dependencies: [
    {
      packageJson: {
        name: '@diez/web-sdk-common',
        versionConstraint: `^${diezVersion}`,
      },
    },
  ],
};

export = binding;
