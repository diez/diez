import {Image} from '@diez/prefabs';
import {joinToKebabCase, WebBinding, WebLanguages} from '@diez/targets';
import {join} from 'path';
import {getQualifiedCssUrl, sourcesPath} from '../../utils';

const binding: WebBinding<Image> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Image.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Image.d.ts')],
  examples: [
    {
      example: 'Helpers',
      comment: '`Image` can be used via mixins, pre-made classes, and provided JavaScript functions.',
      snippets: [
        {
          lang: WebLanguages.Scss,
          template: '@include {{path style="kebab" separator="-"}}-background();',
        },
        {
          lang: WebLanguages.Css,
          template: '.{{path style="kebab" separator="-"}}-background();',
        },
        {
          lang: WebLanguages.JavaScript,
          template: 'Object.assign(myImage, {{path}}.backgroundImageStyle);',
        },
      ],
    },
    {
      example: 'Variables',
      comment: 'An `Image` value can be accessed directly via variables.',
      snippets: [
        {
          lang: WebLanguages.Scss,
          template: 'background-image: url(#{\${{path style="kebab" separator="-"~}}});',
        },
        {
          lang: WebLanguages.Css,
          template: 'background-image: var(--{{path style="kebab" separator="-"}});',
        },
        {
          lang: WebLanguages.JavaScript,
          template: 'myImage.url = {{path}}.url',
        },
      ],
    },
  ],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    output.styleSheet.variables.set(name, getQualifiedCssUrl(output, instance.file.src));
    const widthValue = `${instance.size.width}px`;
    const heightValue = `${instance.size.height}px`;
    const sizeValue = `${widthValue} ${heightValue}`;
    output.styleSheet.variables.set(`${name}-width`, widthValue);
    output.styleSheet.variables.set(`${name}-height`, heightValue);
    output.styleSheet.variables.set(`${name}-size`, sizeValue);
    output.styleSheet.styles.insertRule({
      selector: `${name}-background-image`,
      declaration: {
        'background-image': getQualifiedCssUrl(output, instance.file.src),
        width: widthValue,
        height: heightValue,
        'background-size': sizeValue,
      },
    });
  },
};

export = binding;
