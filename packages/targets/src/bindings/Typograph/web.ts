import {Typograph} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {getQualifiedCssUrl} from '../../targets/web.handler';
import {colorToCss, joinToKebabCase, sourcesPath, upsertStyleGroup} from '../../utils';

const keywords = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'math', 'emoji', 'fangsong'];

const binding: WebBinding<Typograph> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Typograph.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Typograph.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    const colorValue = colorToCss(instance.color);
    const fontFamilies = [];

    if (instance.font.name) {
      fontFamilies.push(instance.font.name);
    }

    fontFamilies.push(...instance.font.fallbacks);

    // Generic family names are keywords and must not be quoted.
    const sanitizedFonts = fontFamilies.map((font) =>
      keywords.includes(font) ? font : `"${font}"`,
    );

    if (instance.font.name && instance.font.file && instance.font.file.src) {
      upsertStyleGroup(
        output.styles.fonts,
        instance.font.name,
        [
          ['font-family', `"${instance.font.name}"`],
          ['font-weight', instance.font.weight.toString()],
          ['font-style', instance.font.style.toString()],
          ['src', `local("${instance.font.name}"), ${getQualifiedCssUrl(output, instance.font.file.src)}`],
        ],
      );
    }
    upsertStyleGroup(
      output.styles.ruleGroups,
      name,
      [
        ['font-family', sanitizedFonts.join()],
        ['font-weight', instance.font.weight.toString()],
        ['font-style', instance.font.style.toString()],
        ['font-size', `${instance.fontSize}px`],
        ['color', colorValue],
      ],
    );
  },
};

export = binding;
