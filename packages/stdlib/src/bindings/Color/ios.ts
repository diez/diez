import {Color} from '@diez/prefabs';
import {IosBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Color> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Color+Binding.swift')],
};

export = binding;
