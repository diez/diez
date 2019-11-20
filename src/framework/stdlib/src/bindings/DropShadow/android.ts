import {DropShadow} from '@diez/prefabs';
import {AndroidBinding, AndroidLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'android', 'examples', 'DropShadow');

const binding: AndroidBinding<DropShadow> = {
  sources: [],
  examples: [{
    example: 'DropShadow',
    comment: 'While the DropShadow compoment is accessible in the generated Android SDK, no bindings are provided. We recommend defining an "elevation" property that can be consumed by Android clients instead. See [Panel](https://diez.org/docs/latest/classes/framework_prefabs.panel.html).',
    snippets: [
      {
        lang: AndroidLanguages.Kotlin,
        templatePath: join(examplesPath, 'DropShadow.kotlin.handlebars'),
      },
      {
        lang: AndroidLanguages.Java,
        templatePath: join(examplesPath, 'DropShadow.java.handlebars'),
      },
    ],
  }],
};

export = binding;
