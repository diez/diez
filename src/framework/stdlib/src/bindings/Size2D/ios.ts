import {Size2D} from '@diez/prefabs';
import {IosBinding, IosLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'ios', 'examples', 'Size2D');

const binding: IosBinding<Size2D> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Size2D+Binding.swift')],
  examples: [{
    example: 'CGSize',
    snippets: [
      {
        lang: IosLanguages.Swift,
        templatePath: join(examplesPath, 'CGSize.swift.handlebars'),
      },
      {
        lang: IosLanguages.ObjectiveC,
        templatePath: join(examplesPath, 'CGSize.objc.handlebars'),
      },
    ],
  }],
};

export = binding;
