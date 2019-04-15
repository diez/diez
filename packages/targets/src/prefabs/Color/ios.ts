import {Color} from '@diez/designsystem';
import {join} from 'path';
import {IosPrefab} from '../../api';
import {sourcesPath} from '../../utils';

const prefab: IosPrefab = {
  sources: [join(sourcesPath, 'ios', 'prefabs', 'Color.swift')],
  imports: ['UIKit'],
  // FIXME: can we make UIColors updateable? Possibly not!
  updateable: false,
  initializer: (instance: Color) => {
    const {h, s, l, a} = instance.serialize();
    return `Color(withHue: ${h}, withSaturation: ${s}, withLightness: ${l}, withAlpha: ${a})`;
  },
};

export = prefab;
