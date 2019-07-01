import {Image} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {getQualifiedCssUrl} from '../../targets/web.handler';
import {joinToKebabCase, sourcesPath} from '../../utils';

const binding: WebBinding<Image> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Image.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Image.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    output.styles.variables.set(name, getQualifiedCssUrl(output, instance.file.src));
    output.styles.variables.set(`${name}-2x`, getQualifiedCssUrl(output, instance.file2x.src));
    output.styles.variables.set(`${name}-3x`, getQualifiedCssUrl(output, instance.file3x.src));
  },
};

export = binding;
