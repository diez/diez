import {Color} from '@diez/prefabs';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Color> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Color+Binding.swift')],
};

export = binding;
