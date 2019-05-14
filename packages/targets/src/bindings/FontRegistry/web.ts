import {FontRegistry} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {sourcesPath} from '../../utils';

const binding: WebBinding<FontRegistry> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'FontRegistry.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'FontRegistry.d.ts')],
  skipGeneration: true,
};

export = binding;
