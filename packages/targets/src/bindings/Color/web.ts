import {Color} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {colorToCss, joinToKebabCase, sourcesPath, upsertStyleGroup} from '../../utils';

const binding: WebBinding<Color> = {
  sources: [join(sourcesPath, 'web', 'js', 'bindings', 'Color.js')],
  declarations: [join(sourcesPath, 'web', 'js', 'bindings', 'Color.d.ts')],
  assetsBinder: async (instance, program, {styles}, spec, property) => {
    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (property.parentType === 'Typograph') {
      return;
    }

    const name = joinToKebabCase(property.parentType, property.name);
    const value = colorToCss(instance);

    upsertStyleGroup(styles.ruleGroups, `${name}-background-color`, [['background-color', value]]);
    upsertStyleGroup(styles.ruleGroups, `${name}-color`, [['color', value]]);
    styles.variables.set(name, value);
  },
};

export = binding;
