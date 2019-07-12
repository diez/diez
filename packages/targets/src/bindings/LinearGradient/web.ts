import {diezVersion} from '@diez/cli-core';
import {LinearGradient} from '@diez/prefabs';
import {linearGradientToCss} from '@diez/web-sdk-common';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {joinToKebabCase, sourcesPath, upsertStyleGroup} from '../../utils';

const binding: WebBinding<LinearGradient> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'LinearGradient.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'LinearGradient.d.ts')],
  assetsBinder: async (instance, program, {styles}, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    const value = linearGradientToCss(instance);

    upsertStyleGroup(styles.ruleGroups, `${name}-background`, [['background', value]]);
    upsertStyleGroup(styles.ruleGroups, `${name}-background-image`, [['background-image', value]]);
    styles.variables.set(name, value);
  },
  dependencies: [{
    packageJson: {
      name: '@diez/web-sdk-common',
      versionConstraint: `^${diezVersion}`,
    },
  }],
};

export = binding;
