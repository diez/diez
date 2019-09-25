import {Lottie} from '@diez/prefabs';
import {AndroidBinding, AndroidLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'android', 'examples', 'Lottie');

const binding: AndroidBinding<Lottie> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Lottie.kt')],
  dependencies: [{
    gradle: {
      name: 'lottie',
      minVersion: '3.0.1',
      source: 'com.airbnb.android:lottie',
    },
  }],
  examples: [{
    example: 'LottieAnimationView',
    snippets: [
      {
        lang: AndroidLanguages.Kotlin,
        templatePath: join(examplesPath, 'LottieAnimationView.kotlin.handlebars'),
      },
      {
        lang: AndroidLanguages.Java,
        templatePath: join(examplesPath, 'LottieAnimationView.java.handlebars'),
      },
    ],
  }],
};

export = binding;
