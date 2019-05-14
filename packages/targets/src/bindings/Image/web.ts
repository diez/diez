import {Image} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {sourcesPath} from '../../utils';

const binding: WebBinding<Image> = {
  sources: [
    join(sourcesPath, 'web', 'bindings', 'Image.js'),
    join(sourcesPath, 'web', 'bindings', 'File.js'),
  ],
  declarations: [
    join(sourcesPath, 'web', 'bindings', 'Image.d.ts'),
    join(sourcesPath, 'web', 'bindings', 'File.d.ts'),
  ],
};

export = binding;
