import {TextStyle} from '@diez/prefabs';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<TextStyle> = {
  sources: [
    join(sourcesPath, 'android', 'bindings', 'TextStyle.kt'),
    join(sourcesPath, 'android', 'bindings', 'FontRegistry.kt'),
  ],
};

export = binding;
