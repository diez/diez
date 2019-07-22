import {Image} from '@diez/prefabs';
import {join} from 'path';
import {RuleList, WebBinding} from '../../targets/web.api';
import {getQualifiedCssUrl} from '../../targets/web.handler';
import {joinToKebabCase, sourcesPath} from '../../utils';

const binding: WebBinding<Image> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Image.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Image.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    output.styleSheet.variables.set(name, getQualifiedCssUrl(output, instance.file.src));
    output.styleSheet.variables.set(`${name}-2x`, getQualifiedCssUrl(output, instance.file2x.src));
    output.styleSheet.variables.set(`${name}-3x`, getQualifiedCssUrl(output, instance.file3x.src));
    output.styleSheet.variables.set(`${name}-width`, `${instance.width}px`);
    output.styleSheet.variables.set(`${name}-height`, `${instance.height}px`);
    output.styleSheet.styles.insertRule({
      selector: `${name}-background-image`,
      declaration: {
        'background-image': getQualifiedCssUrl(output, instance.file.src),
        width: `${instance.width}px`,
        height: `${instance.height}px`,
        'background-size': `${instance.width}px ${instance.height}px`,
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
