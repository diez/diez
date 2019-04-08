import {FontRegistry} from '@livedesigner/designsystem';
import {join} from 'path';
import {IosPrefab} from '../../api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/ios';

const prefab: IosPrefab = {
  sources: [join(sourcesPath, 'ios', 'prefabs', 'FontRegistry.swift')],
  imports: ['UIKit'],
  updateable: true,
  initializer: (instance: FontRegistry) => `FontRegistry(withFiles: [
${instance.files.map((file) => `            ${fileInitializer!(file)},`).join('\n')}
        ])`,
};

export = prefab;
