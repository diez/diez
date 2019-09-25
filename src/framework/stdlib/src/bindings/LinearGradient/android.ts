import {LinearGradient} from '@diez/prefabs';
import {AndroidBinding, AndroidLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'android', 'examples', 'LinearGradient');

const binding: AndroidBinding<LinearGradient> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'LinearGradient.kt')],
  examples: [{
    example: 'ShaderFactory',
    snippets: [
      {
        lang: AndroidLanguages.Kotlin,
        templatePath: join(examplesPath, 'ShaderFactory.kotlin.handlebars'),
      },
      {
        lang: AndroidLanguages.Java,
        templatePath: join(examplesPath, 'ShaderFactory.java.handlebars'),
      },
    ],
  }],
};

export = binding;
