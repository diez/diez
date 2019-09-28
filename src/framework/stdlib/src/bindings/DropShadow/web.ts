import {diezVersion} from '@diez/cli-core';
import {DropShadow} from '@diez/prefabs';
import {joinToKebabCase, WebBinding, WebLanguages} from '@diez/targets';
import {dropShadowToCss, dropShadowToFilterCss} from '@diez/web-sdk-common';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: WebBinding<DropShadow> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'DropShadow.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'DropShadow.d.ts')],
  examples: [
    {
      example: 'Helpers',
      comment: '`DropShadow` can also be used via mixins, pre-made classes, and provided JavaScript functions.',
      snippets: [
        {
          lang: WebLanguages.Scss,
          template: '@include {{path style="kebab" separator="-"}}-box-shadow();',
        },
        {
          lang: WebLanguages.Css,
          template: '.{{path style="kebab" separator="-"}}-box-shadow();',
        },
        {
          lang: WebLanguages.JavaScript,
          template: 'Object.assign(myElement, {{path}}.boxShadowStyle);',
        },
      ],
    },
    {
      example: 'Variables',
      comment: 'A `DropShadow` value can be accessed directly via variables.',
      snippets: [
        {
          lang: WebLanguages.Scss,
          template: 'box-shadow: url(#{\${{path style="kebab" separator="-"~}}});',
        },
        {
          lang: WebLanguages.Css,
          template: 'box-shadow: var(--{{path style="kebab" separator="-"}});',
        },
        {
          lang: WebLanguages.JavaScript,
          template: 'myElement.style.boxShadow = {{path}}.boxShadow',
        },
      ],
    },
  ],
  assetsBinder: async (instance, program, output, spec, property) => {
    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (property.parentType === 'Panel') {
      return;
    }

    const name = joinToKebabCase(property.parentType, property.name);
    const value = dropShadowToCss(instance);
    const filterValue = dropShadowToFilterCss(instance);

    output.styleSheet.styles.insertRule({
      selector: `${name}-box-shadow`,
      declaration: {
        'box-shadow': value,
      },
    });

    output.styleSheet.styles.insertRule({
      selector: `${name}-text-shadow`,
      declaration: {
        'text-shadow': value,
      },
    });

    output.styleSheet.styles.insertRule({
      selector: `${name}-filter`,
      declaration: {
        filter: filterValue,
      },
    });

    output.styleSheet.variables.set(name, value);
    output.styleSheet.variables.set(`${name}-filter`, filterValue);
  },
  dependencies: [{
    packageJson: {
      name: '@diez/web-sdk-common',
      versionConstraint: `^${diezVersion}`,
    },
  }],
};

export = binding;
