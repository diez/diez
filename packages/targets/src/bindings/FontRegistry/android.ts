import {FontRegistry} from '@diez/designsystem';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<FontRegistry> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'FontRegistry.kt')],
  skipGeneration: true,
};

export = binding;
