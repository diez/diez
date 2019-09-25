import {LinearGradient} from '@diez/prefabs';
import {IosBinding, IosLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'ios', 'examples', 'LinearGradient');

const binding: IosBinding<LinearGradient> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'LinearGradient+Binding.swift'),
  ],
  examples: [
    {
      example: 'CAGradientLayer',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'CAGradientLayer.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'CAGradientLayer.objc.handlebars'),
        },
      ],
    },
    {
      example: 'LinearGradientView',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'LinearGradientView.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'LinearGradientView.objc.handlebars'),
        },
      ],
    },
  ],
};

export = binding;
