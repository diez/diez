import {Typograph} from '@diez/prefabs';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Typograph> = {
  sources: [
    join(sourcesPath, 'android', 'bindings', 'Typograph.kt'),
    join(sourcesPath, 'android', 'bindings', 'FontRegistry.kt'),
  ],
};

export = binding;
