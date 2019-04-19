import {Lottie} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/ios';

const binding: IosBinding<Lottie> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Lottie.swift'), 
    join(sourcesPath, 'ios', 'bindings', 'Lottie+LOTAnimationView.swift'),
  ],
  imports: ['UIKit', 'Lottie'],
  updateable: true,
  initializer: (instance) =>
    `Lottie(file: ${fileInitializer!(instance.file)})`,
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
