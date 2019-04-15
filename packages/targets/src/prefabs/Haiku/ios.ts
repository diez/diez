import {Haiku} from '@diez/designsystem';
import {join} from 'path';
import {IosPrefab} from '../../api';
import {sourcesPath} from '../../utils';

const prefab: IosPrefab = {
  sources: [join(sourcesPath, 'ios', 'prefabs', 'Haiku.swift')],
  imports: ['UIKit.UIView', 'WebKit'],
  updateable: true,
  initializer: (instance: Haiku) => `Haiku(withComponent: "${instance.component}")`,
};

export = prefab;
