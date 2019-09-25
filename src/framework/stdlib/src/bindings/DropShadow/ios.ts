import {DropShadow} from '@diez/prefabs';
import {IosBinding, IosLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'ios', 'examples', 'DropShadow');

const binding: IosBinding<DropShadow> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'DropShadow+Binding.swift'),
  ],
  examples: [{
    example: 'CALayer',
    snippets: [
      {
        lang: IosLanguages.Swift,
        templatePath: join(examplesPath, 'CALayer.swift.handlebars'),
      },
      {
        lang: IosLanguages.ObjectiveC,
        templatePath: join(examplesPath, 'CALayer.objc.handlebars'),
      },
    ],
  }],
};

export = binding;
