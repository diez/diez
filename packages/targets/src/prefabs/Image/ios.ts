import {Image} from '@diez/designsystem';
import {join} from 'path';
import {IosPrefab} from '../../api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/ios';

const prefab: IosPrefab = {
  sources: [join(sourcesPath, 'ios', 'prefabs', 'Image.swift')],
  imports: ['UIKit'],
  updateable: true,
  initializer: (instance: Image) =>
    `Image(withFile: ${fileInitializer!(instance.file)}, withWidth: ${instance.width}, ` +
    `withHeight: ${instance.height}, withScale: ${instance.scale})`,
};

export = prefab;
