import {Panel} from '@diez/prefabs';
import {IosBinding, IosLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'ios', 'examples', 'Panel');

const binding: IosBinding<Panel> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'PanelView.swift'),
  ],
  examples: [{
    example: 'PanelView',
    snippets: [
      {
        lang: IosLanguages.Swift,
        templatePath: join(examplesPath, 'PanelView.swift.handlebars'),
      },
      {
        lang: IosLanguages.ObjectiveC,
        templatePath: join(examplesPath, 'PanelView.objc.handlebars'),
      },
    ],
  }],
};

export = binding;
