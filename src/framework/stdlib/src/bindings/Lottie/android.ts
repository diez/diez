import {Lottie} from '@diez/prefabs';
import {AndroidBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Lottie> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Lottie.kt')],
  dependencies: [{
    gradle: {
      name: 'lottie',
      minVersion: '3.0.1',
      source: 'com.airbnb.android:lottie',
    },
  }],
};

export = binding;
