import {Typograph} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {colorToCss, joinToKebabCase, sourcesPath, upsertStyleGroup} from '../../utils';

const binding: WebBinding<Typograph> = {
  sources: [join(sourcesPath, 'web', 'js', 'bindings', 'Typograph.js')],
  declarations: [join(sourcesPath, 'web', 'js', 'bindings', 'Typograph.d.ts')],
  assetsBinder: async (instance, program, {styles, staticFolder}, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    const colorValue = colorToCss(instance.color);
    upsertStyleGroup(
      styles.fonts,
      instance.font.name,
      [
        ['font-family', `"${instance.font.name}"`],
        ['src', `url("./${staticFolder}/${instance.font.file.src}")`],
      ],
    );
    upsertStyleGroup(
      styles.ruleGroups,
      name,
      [
        ['font-family', `"${instance.font.name}"`],
        ['font-size', `${instance.fontSize}px`],
        ['color', colorValue],
      ],
    );
  },
};

export = binding;
