import {diezVersion} from '@diez/cli-core';
import {LinearGradient} from '@diez/prefabs';
import {joinToKebabCase, WebBinding, WebLanguages} from '@diez/targets';
import {linearGradientToCss} from '@diez/web-sdk-common';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: WebBinding<LinearGradient> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'LinearGradient.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'LinearGradient.d.ts')],
  examples: [
    {
      example: 'Helpers',
      comment: '`LinearGradient` can be used via mixins, pre-made classes, and provided JavaScript functions.',
      snippets: [
        {
          lang: WebLanguages.Scss,
          template: '@include {{path style="kebab" separator="-"}}-background();',
        },
        {
          lang: WebLanguages.Css,
          template: '.{{path style="kebab" separator="-"}}-background {}',
        },
        {
          lang: WebLanguages.JavaScript,
          template: 'Object.assign(myElement, {{path}}.backgroundStyle);',
        },
      ],
    },
    {
      example: 'Variables',
      comment: 'A `LinearGradient` value can be accessed directly via variables.',
      snippets: [
        {
          lang: WebLanguages.Scss,
          template: 'background: \${{path style="kebab" separator="-"~}}};',
        },
        {
          lang: WebLanguages.Css,
          template: 'background: var(--{{path style="kebab" separator="-"}});',
        },
        {
          lang: WebLanguages.JavaScript,
          template: 'myElement.style.background = {{path}}.linearGradient;',
        },
      ],
    },
  ],
  assetsBinder: async (instance, program, output, spec, property) => {
    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (property.parentType === 'Fill') {
      return;
    }

    const name = joinToKebabCase(property.parentType, property.name);
    const value = linearGradientToCss(instance);

    output.styleSheet.styles.insertRule({
      selector: `${name}-background`,
      declaration: {
        background: value,
      },
    });

    output.styleSheet.styles.insertRule({
      selector: `${name}-background-image`,
      declaration: {
        'background-image': value,
      },
    });

    output.styleSheet.variables.set(name, value);
  },
  dependencies: [{
    packageJson: {
      name: '@diez/web-sdk-common',
      versionConstraint: `^${diezVersion}`,
    },
  }],
};

export = binding;
