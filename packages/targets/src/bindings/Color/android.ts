import {Color} from '@diez/designsystem';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Color> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Color.kt')],
};

export = binding;
