import {Typograph} from '@diez/prefabs';
import {AndroidBinding, AndroidLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'android', 'examples', 'Typograph');

const binding: AndroidBinding<Typograph> = {
  sources: [
    join(sourcesPath, 'android', 'bindings', 'Typograph.kt'),
  ],
  examples: [{
    example: 'TextView',
    snippets: [
      {
        lang: AndroidLanguages.Kotlin,
        templatePath: join(examplesPath, 'TextView.kotlin.handlebars'),
      },
      {
        lang: AndroidLanguages.Java,
        templatePath: join(examplesPath, 'TextView.java.handlebars'),
      },
    ],
  }],
};

export = binding;
