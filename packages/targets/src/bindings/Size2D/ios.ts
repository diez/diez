import {Size2D} from '@diez/prefabs';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Size2D> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Size2D+Binding.swift')],
};

export = binding;
