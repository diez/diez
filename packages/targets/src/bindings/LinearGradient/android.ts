import {LinearGradient} from '@diez/prefabs';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<LinearGradient> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'LinearGradient.kt')],
};

export = binding;
