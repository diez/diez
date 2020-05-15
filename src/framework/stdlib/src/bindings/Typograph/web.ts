import {diezVersion} from '@diez/cli-core';
import {FileType, Typograph} from '@diez/prefabs';
import {joinToKebabCase, WebBinding, WebLanguages} from '@diez/targets';
import {colorToCss, fontToCss, GoogleFontCollection, textAlignmentToCss, textDecorationsToCss} from '@diez/web-sdk-common';
import {join} from 'path';
import {getQualifiedCssUrl, sourcesPath} from '../../utils';

const googleFontCollection = new GoogleFontCollection();

const binding: WebBinding<Typograph> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Typograph.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Typograph.d.ts')],
  examples: [
    {
      example: 'Helpers',
      comment: '`Typograph` can be used via mixins, pre-made classes, and provided JavaScript functions.',
      snippets: [
        {
          lang: WebLanguages.Scss,
          template: '@include {{path style="kebab" separator="-"}}();',
        },
        {
          lang: WebLanguages.Css,
          template: '.{{path style="kebab" separator="-"}} {}',
        },
        {
          lang: WebLanguages.JavaScript,
          template: 'Object.assign(myHeading, {{path}}.style);',
        },
      ],
    },
  ],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    const colorValue = colorToCss(instance.color);
    const fontFamily = fontToCss(instance.font);

    if (instance.font.file && instance.font.file.type === FileType.Remote) {
      googleFontCollection.set(instance.font.name, {weight: instance.font.weight, style: instance.font.style});
      output.resources.set('GoogleFonts', googleFontCollection);
    } else if (instance.font.name && instance.font.file && instance.font.file.src) {
      output.styleSheet.font.insertRule({
        selector: instance.font.name,
        declaration: {
          'font-family': `"${instance.font.name}"`,
          'font-weight': instance.font.weight.toString(),
          'font-style': instance.font.style.toString(),
          src: `local("${instance.font.name}"), ${getQualifiedCssUrl(output, instance.font.file.src)}`,
        },
      });
    }

    const declaration = {
      'font-family': fontFamily,
      'font-weight': instance.font.weight.toString(),
      'font-style': instance.font.style.toString(),
      'font-size': `${instance.fontSize}px`,
      color: colorValue,
      'letter-spacing': `${instance.letterSpacing}px`,
      'text-align': textAlignmentToCss(instance.alignment),
      'text-decoration': textDecorationsToCss(instance.decoration),
    };
    if (instance.lineHeight !== -1) {
      Object.assign(declaration, {'line-height': `${instance.lineHeight}px`});
    }
    output.styleSheet.styles.insertRule({
      declaration,
      selector: name,
    });
  },
  dependencies: [{
    packageJson: {
      name: '@diez/web-sdk-common',
      versionConstraint: `^${diezVersion}`,
    },
  }],
};

export = binding;
