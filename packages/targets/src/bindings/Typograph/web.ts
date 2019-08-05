import {diezVersion} from '@diez/cli-core';
import {Typograph} from '@diez/prefabs';
import {colorToCss, fontToCss} from '@diez/web-sdk-common';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {getQualifiedCssUrl} from '../../targets/web.handler';
import {joinToKebabCase, sourcesPath} from '../../utils';

const binding: WebBinding<Typograph> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Typograph.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Typograph.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    const colorValue = colorToCss(instance.color);
    const fontFamily = fontToCss(instance.font);

    if (instance.font.name && instance.font.file && instance.font.file.src) {
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
    output.styleSheet.styles.insertRule({
      selector: name,
      declaration: {
        'font-family': fontFamily,
        'font-weight': instance.font.weight.toString(),
        'font-style': instance.font.style.toString(),
        'font-size': `${instance.fontSize}px`,
        color: colorValue,
      },
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
