import {Color} from '@diez/designsystem';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Color> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Color.kt')],
  imports: [
    'android.graphics.Color as CoreColor',
    'android.support.v4.graphics.ColorUtils',
    'com.squareup.moshi.FromJson',
    'com.squareup.moshi.JsonQualifier',
    'com.squareup.moshi.ToJson',
    'kotlin.annotation.AnnotationRetention.RUNTIME',
  ],
  adapters: ['colorAdapter'],
  qualifier: '@QualifiedColor',
  initializer: (instance) => {
    const {h, s, l, a} = instance.serialize();
    return `ColorAdapter.hsla(WireColor(${h}F, ${s}F, ${l}F, ${a}F)`;
  },
};

export = binding;
