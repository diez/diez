import {Panel} from '@diez/prefabs';
import {joinToKebabCase, WebBinding, WebLanguages} from '@diez/targets';
import {dropShadowToCss, fillToBackgroundCss} from '@diez/web-sdk-common';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: WebBinding<Panel> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Panel.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Panel.d.ts')],
  examples: [
    {
      example: 'Helpers',
      comment: '`Panel` can also be used via mixins, pre-made classes, and provided JavaScript functions.',
      snippets: [
        {
          lang: WebLanguages.Scss,
          template: '@include {{path style="kebab" separator="-"}}-panel();',
        },
        {
          lang: WebLanguages.Css,
          template: '.{{path style="kebab" separator="-"}}-panel {}',
        },
        {
          lang: WebLanguages.JavaScript,
          template: 'Object.assign(myElement, {{path}}.style);',
        },
      ],
    },
  ],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);

    output.styleSheet.styles.insertRule({
      selector: name,
      declaration: {
        'box-shadow': dropShadowToCss(instance.dropShadow),
        'border-radius': `${instance.cornerRadius}px`,
        background: fillToBackgroundCss(instance.background),
      },
    });
  },
};

export = binding;
