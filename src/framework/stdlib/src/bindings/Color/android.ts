import {Color} from '@diez/prefabs';
import {AndroidBinding, AndroidLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'android', 'examples', 'Color');

const binding: AndroidBinding<Color> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Color.kt')],
  examples: [{
    example: 'Color',
    snippets: [
      {
        lang: AndroidLanguages.Kotlin,
        templatePath: join(examplesPath, 'Color.kotlin.handlebars'),
      },
      {
        lang: AndroidLanguages.Java,
        templatePath: join(examplesPath, 'Color.java.handlebars'),
      },
    ],
  }],
};

export = binding;
