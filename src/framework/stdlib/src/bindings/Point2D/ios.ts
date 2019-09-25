import {Point2D} from '@diez/prefabs';
import {IosBinding, IosLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'ios', 'examples', 'Point2D');

const binding: IosBinding<Point2D> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Point2D+Binding.swift'),
  ],
  examples: [{
    example: 'CGPoint',
    snippets: [
      {
        lang: IosLanguages.Swift,
        templatePath: join(examplesPath, 'CGPoint.swift.handlebars'),
      },
      {
        lang: IosLanguages.ObjectiveC,
        templatePath: join(examplesPath, 'CGPoint.objc.handlebars'),
      },
    ],
  }],
};

export = binding;
