import {Vector} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {sourcesPath} from '../../utils';

const binding: WebBinding<Vector> = {
  sources: [
    join(sourcesPath, 'web', 'bindings', 'Vector.js'),
    join(sourcesPath, 'web', 'bindings', 'File.js'),
  ],
  declarations: [
    join(sourcesPath, 'web', 'bindings', 'Vector.d.ts'),
    join(sourcesPath, 'web', 'bindings', 'File.d.ts'),
  ],
};

export = binding;
