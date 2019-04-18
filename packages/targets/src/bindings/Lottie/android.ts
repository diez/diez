import {Lottie} from '@diez/designsystem';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/android';

const binding: AndroidBinding<Lottie> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Lottie.kt')],
  imports: [
    'android.util.Log',
    'android.view.ViewGroup',
    'android.widget.FrameLayout',
    'com.airbnb.lottie.*',
  ],
  initializer: (instance) => `Lottie(${fileInitializer!(instance.file)})`,
  dependencies: [],
};

export = binding;
