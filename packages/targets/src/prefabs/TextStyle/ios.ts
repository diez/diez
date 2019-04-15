import {TextStyle} from '@diez/designsystem';
import {join} from 'path';
import {IosPrefab} from '../../api';
import {sourcesPath} from '../../utils';
import {initializer as colorInitializer} from '../Color/ios';

const prefab: IosPrefab = {
  sources: [join(sourcesPath, 'ios', 'prefabs', 'TextStyle.swift')],
  imports: ['UIKit'],
  updateable: true,
  initializer: (instance: TextStyle) =>
    `TextStyle(withFont: "${instance.font}", withFontSize: ${instance.fontSize}, ` +
    `withColor: ${colorInitializer!(instance.color)})`,
};

export = prefab;
