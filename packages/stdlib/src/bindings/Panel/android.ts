import {Panel} from '@diez/prefabs';
import {AndroidBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Panel> = {
  sources: [
    join(sourcesPath, 'android', 'bindings', 'Panel.kt'),
  ],
};

export = binding;
