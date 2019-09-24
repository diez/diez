import {Size2D} from '@diez/prefabs';
import {IosBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Size2D> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Size2D+Binding.swift')],
};

export = binding;
