import {Lottie} from '@diez/prefabs';
import {IosBinding, IosLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'ios', 'examples', 'Lottie');

const binding: IosBinding<Lottie> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Lottie+Binding.swift'),
    join(sourcesPath, 'ios', 'bindings', 'Lottie+AnimationView.swift'),
  ],
  dependencies: [{
    cocoapods: {
      name: 'lottie-ios',
      versionConstraint: '~> 3.1.1',
    },
    carthage: {
      name: 'Lottie',
      github: 'airbnb/lottie-ios',
      versionConstraint: '~> 3.1.1',
    },
  }],
  examples: [{
    example: 'AnimationView',
    snippets: [
      {
        lang: IosLanguages.Swift,
        templatePath: join(examplesPath, 'AnimationView.swift.handlebars'),
      },
      {
        lang: IosLanguages.ObjectiveC,
        templatePath: join(examplesPath, 'AnimationView.objc.handlebars'),
      },
    ],
  }],
};

export = binding;
