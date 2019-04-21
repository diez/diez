import {Color} from '@diez/designsystem';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Color> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Color.kt')],
  adapters: ['colorAdapter'],
  qualifier: '@QualifiedColor',
  initializer: (instance) => {
    const {h, s, l, a} = instance.serialize();
    return `ColorAdapter.hsla(WireColor(${h}F, ${s}F, ${l}F, ${a}F)`;
  },
};

export = binding;
