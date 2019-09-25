import {Point2D} from '@diez/prefabs';
import {AndroidBinding, AndroidLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'android', 'examples', 'Point2D');

const binding: AndroidBinding<Point2D> = {
  sources: [],
  examples: [{
    example: 'Point2D',
    snippets: [
      {
        lang: AndroidLanguages.Kotlin,
        templatePath: join(examplesPath, 'Point2D.kotlin.handlebars'),
      },
      {
        lang: AndroidLanguages.Java,
        templatePath: join(examplesPath, 'Point2D.java.handlebars'),
      },
    ],
  }],
};

export = binding;
