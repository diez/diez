import {Panel} from '@diez/prefabs';
import {AndroidBinding, AndroidLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'android', 'examples', 'Panel');

const binding: AndroidBinding<Panel> = {
  sources: [
    join(sourcesPath, 'android', 'bindings', 'Panel.kt'),
  ],
  examples: [{
    example: 'PanelView',
    comment: 'PanelView inherits from [LinearLayout](https://developer.android.com/reference/android/widget/LinearLayout).',
    snippets: [
      {
        lang: AndroidLanguages.Kotlin,
        templatePath: join(examplesPath, 'PanelView.kotlin.handlebars'),
      },
      {
        lang: AndroidLanguages.Java,
        templatePath: join(examplesPath, 'PanelView.java.handlebars'),
      },
    ],
  }],
};

export = binding;
