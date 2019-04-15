import {encodeFileSource, File} from '@diez/designsystem';
import {join} from 'path';
import {IosPrefab} from '../../api';
import {sourcesPath} from '../../utils';

const prefab: IosPrefab = {
  sources: [join(sourcesPath, 'ios', 'prefabs', 'File.swift')],
  imports: ['Foundation'],
  updateable: false,
  initializer: (instance: File) => `File(withSrc: "${encodeFileSource(instance.src)}")`,
};

export = prefab;
