import {Color} from '@diez/prefabs';
import {AndroidBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Color> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Color.kt')],
};

export = binding;
