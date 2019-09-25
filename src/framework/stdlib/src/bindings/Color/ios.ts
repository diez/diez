import {Color} from '@diez/prefabs';
import {IosBinding, IosLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'ios', 'examples', 'Color');

const binding: IosBinding<Color> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Color+Binding.swift')],
  examples: [{
    example: 'UIColor',
    snippets: [
      {
        lang: IosLanguages.Swift,
        templatePath: join(examplesPath, 'UIColor.swift.handlebars'),
      },
      {
        lang: IosLanguages.ObjectiveC,
        templatePath: join(examplesPath, 'UIColor.objc.handlebars'),
      },
    ],
  }],
};

export = binding;
