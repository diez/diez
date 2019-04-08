import {SVG} from '@livedesigner/designsystem';
import {join} from 'path';
import {IosPrefab} from '../../api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/ios';

const prefab: IosPrefab = {
  sources: [join(sourcesPath, 'ios', 'prefabs', 'SVG.swift')],
  imports: ['UIKit', 'WebKit'],
  updateable: true,
  initializer: (instance: SVG) =>
    `SVG(withFile: ${fileInitializer!(instance.file)})`,
};

export = prefab;
