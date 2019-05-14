import {TextStyle} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {sourcesPath} from '../../utils';

const binding: WebBinding<TextStyle> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'TextStyle.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'TextStyle.d.ts')],
};

export = binding;
