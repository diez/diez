import {LinearGradient} from '@diez/prefabs';
import {AndroidBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<LinearGradient> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'LinearGradient.kt')],
};

export = binding;
