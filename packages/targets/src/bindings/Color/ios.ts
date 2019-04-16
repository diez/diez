import {Color} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Color> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Color.swift')],
  imports: ['UIKit'],
  // FIXME: can we make UIColors updateable? Possibly not!
  updateable: false,
  initializer: (instance) => {
    const {h, s, l, a} = instance.serialize();
    return `Color(withHue: ${h}, withSaturation: ${s}, withLightness: ${l}, withAlpha: ${a})`;
  },
};

export = binding;
