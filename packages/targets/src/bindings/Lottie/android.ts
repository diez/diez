import {Lottie} from '@diez/designsystem';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Lottie> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Lottie.kt')],
  dependencies: [{
    gradle: {
      name: 'lottie',
      minVersion: '2.7.0',
      source: 'com.airbnb.android:lottie',
    },
  }],
};

export = binding;
