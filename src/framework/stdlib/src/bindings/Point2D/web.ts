import {Point2D} from '@diez/prefabs';
import {joinToKebabCase, WebBinding, WebLanguages} from '@diez/targets';
import {updateStyleSheetWithUnitedVariables} from '../../utils';

const binding: WebBinding<Point2D> = {
  // TODO: Remove the need to provide an empty binding on prefabs without any binding overrides.
  // Provide an empty array to prevent this prefab from being treated as a singleton.
  sources: [],
  examples: [
    {
      example: 'Variables',
      comment: '`Point2D` values can be accessed directly via variables.',
      snippets: [
        {
          lang: WebLanguages.Scss,
          template: 'top: #{\${{path style="kebab" separator="-"~}}-y-px;',
        },
        {
          lang: WebLanguages.Css,
          template: 'top: var(--{{path style="kebab" separator="-"}}-y-px);',
        },
        {
          lang: WebLanguages.JavaScript,
          template: 'myElement.style.top = {{path}}.y',
        },
      ],
    },
  ],
  assetsBinder: async (instance, program, output, spec, property) => {
    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (property.parentType !== 'LinearGradient' && property.parentType !== 'DropShadow') {
      const baseName = joinToKebabCase(property.parentType, property.name);

      updateStyleSheetWithUnitedVariables(`${baseName}-x`, `${instance.x}`, output.styleSheet);
      updateStyleSheetWithUnitedVariables(`${baseName}-y`, `${instance.y}`, output.styleSheet);
    }
  },
};

export = binding;
