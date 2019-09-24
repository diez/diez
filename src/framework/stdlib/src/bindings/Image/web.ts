import {Image} from '@diez/prefabs';
import {joinToKebabCase, RuleList, WebBinding} from '@diez/targets';
import {join} from 'path';
import {getQualifiedCssUrl, sourcesPath} from '../../utils';

const binding: WebBinding<Image> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Image.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Image.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    output.styleSheet.variables.set(name, getQualifiedCssUrl(output, instance.file.src));
    output.styleSheet.variables.set(`${name}-2x`, getQualifiedCssUrl(output, instance.file2x.src));
    output.styleSheet.variables.set(`${name}-3x`, getQualifiedCssUrl(output, instance.file3x.src));
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
      rules: new RuleList([
        {
          selector: '(min-device-pixel-ratio: 2), (min-resolution: 2dppx)',
          declaration: {
            'background-image': getQualifiedCssUrl(output, instance.file2x.src),
          },
        },
        {
          selector: '(min-device-pixel-ratio: 3), (min-resolution: 3dppx)',
          declaration: {
            'background-image': getQualifiedCssUrl(output, instance.file3x.src),
          },
        },
      ]),
    });
  },
};

export = binding;
