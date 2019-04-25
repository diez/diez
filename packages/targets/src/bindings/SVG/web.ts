import {SVG} from '@diez/designsystem';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {sourcesPath} from '../../utils';

const binding: WebBinding<SVG> = {
  sources: [
    join(sourcesPath, 'web', 'bindings', 'SVG.js'),
    join(sourcesPath, 'web', 'bindings', 'File.js'),
  ],
  declarations: [
    join(sourcesPath, 'web', 'bindings', 'SVG.d.ts'),
    join(sourcesPath, 'web', 'bindings', 'File.d.ts'),
  ],
};

export = binding;
