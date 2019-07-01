import {Typograph} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {getQualifiedCssUrl} from '../../targets/web.handler';
import {colorToCss, joinToKebabCase, sourcesPath, upsertStyleGroup} from '../../utils';

const binding: WebBinding<Typograph> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Typograph.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Typograph.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    const colorValue = colorToCss(instance.color);
    upsertStyleGroup(
      output.styles.fonts,
      instance.font.name,
      [
        ['font-family', `"${instance.font.name}"`],
        ['src', getQualifiedCssUrl(output, instance.font.file.src)],
      ],
    );
    upsertStyleGroup(
      output.styles.ruleGroups,
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
