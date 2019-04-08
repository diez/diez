import {Lottie} from '@livedesigner/designsystem';
import {join} from 'path';
import {IosPrefab} from '../../api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/ios';

const prefab: IosPrefab = {
  sources: [join(sourcesPath, 'ios', 'prefabs', 'Lottie.swift')],
  imports: ['UIKit', 'Lottie'],
  updateable: true,
  initializer: (instance: Lottie) =>
    `Lottie(withFile: ${fileInitializer!(instance.file)})`,
  dependencies: [{
    cocoapods: {
      name: 'lottie-ios',
      versionConstraint: '~> 2.5.2',
    },
    carthage: {},
    vanilla: {},
  }],
};

export = prefab;
