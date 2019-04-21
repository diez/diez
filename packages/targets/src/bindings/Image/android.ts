import {Image} from '@diez/designsystem';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Image> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Image.kt')],
};

export = binding;
