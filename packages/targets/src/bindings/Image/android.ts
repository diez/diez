import {Image} from '@diez/prefabs';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Image> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Image.kt')],
  dependencies: [{
    gradle: {
      name: 'glide',
      minVersion: '4.9.0',
      source: 'com.github.bumptech.glide:glide',
    },
  }],
};

export = binding;
