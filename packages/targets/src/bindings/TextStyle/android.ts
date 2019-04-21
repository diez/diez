import {TextStyle} from '@diez/designsystem';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<TextStyle> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'TextStyle.kt')],
};

export = binding;
