import {Lottie} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Lottie> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Lottie.swift'),
    join(sourcesPath, 'ios', 'bindings', 'Lottie+LOTAnimationView.swift'),
  ],
  imports: ['UIKit', 'Lottie'],
  dependencies: [{
    cocoapods: {
      name: 'lottie-ios',
      versionConstraint: '~> 2.5.2',
    },
    carthage: {},
    vanilla: {},
  }],
};

export = binding;
