import {Image} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {joinToKebabCase, sourcesPath} from '../../utils';

const binding: WebBinding<Image> = {
  sources: [join(sourcesPath, 'web', 'js', 'bindings', 'Image.js')],
  declarations: [join(sourcesPath, 'web', 'js', 'bindings', 'Image.d.ts')],
  assetsBinder: async (instance, program, {styles, staticFolder}, spec, property) => {
    const name = joinToKebabCase(property.parentType, property.name);
    styles.variables.set(name, `url("./${staticFolder}/${instance.file.src}")`);
    styles.variables.set(`${name}-2x`, `url("./${staticFolder}/${instance.file2x.src}")`);
    styles.variables.set(`${name}-3x`, `url("./${staticFolder}/${instance.file3x.src}")`);
  },
};

export = binding;
