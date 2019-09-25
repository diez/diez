import {Size2D} from '@diez/prefabs';
import {joinToKebabCase, Rule, WebBinding, WebLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath, updateStyleSheetWithUnitedVariables} from '../../utils';

const binding: WebBinding<Size2D> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Size2D.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Size2D.d.ts')],
  examples: [
    {
      example: 'Helpers',
      comment: '`Size2d` can be used via mixins, pre-made classes, and provided JavaScript functions.',
      snippets: [
        {
          lang: WebLanguages.Scss,
          template: '@include {{path style="kebab" separator="-"}}-size();',
        },
        {
          lang: WebLanguages.Css,
          template: '.{{path style="kebab" separator="-"}}-size {}',
        },
        {
          lang: WebLanguages.JavaScript,
          template: 'Object.assign(myElement, {{path}}.style);',
        },
      ],
    },
  ],
  assetsBinder: async (instance, program, output, spec, property) => {
    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (property.parentType !== 'Image') {
      const baseName = joinToKebabCase(property.parentType, property.name);
      const rule: Rule = {
        selector: baseName,
        declaration: {},
      };

      if (instance.width) {
        updateStyleSheetWithUnitedVariables(`${baseName}-width`, `${instance.width}`, output.styleSheet);
        rule.declaration.width = `${instance.width}px`;
      }

      if (instance.height) {
        updateStyleSheetWithUnitedVariables(`${baseName}-height`, `${instance.height}`, output.styleSheet);
        rule.declaration.height = `${instance.height}px`;
      }

      if (instance.width || instance.height) {
        output.styleSheet.styles.insertRule(rule);
      }
    }
  },
};

export = binding;
