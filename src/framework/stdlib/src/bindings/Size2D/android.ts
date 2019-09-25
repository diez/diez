import {Size2D} from '@diez/prefabs';
import {AndroidBinding, AndroidLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'android', 'examples', 'Size2D');

const binding: AndroidBinding<Size2D> = {
  sources: [],
  examples: [{
    example: 'Size2D',
    snippets: [
      {
        lang: AndroidLanguages.Kotlin,
        templatePath: join(examplesPath, 'Size2D.kotlin.handlebars'),
      },
      {
        lang: AndroidLanguages.Java,
        templatePath: join(examplesPath, 'Size2D.java.handlebars'),
      },
    ],
  }],
};

export = binding;
