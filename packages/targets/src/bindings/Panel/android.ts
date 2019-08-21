import {Panel} from '@diez/prefabs';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Panel> = {
  sources: [
    join(sourcesPath, 'android', 'bindings', 'Panel.kt'),
  ],
};

export = binding;
