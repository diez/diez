import {Color} from '@diez/prefabs';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Color> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Color.kt')],
};

export = binding;
