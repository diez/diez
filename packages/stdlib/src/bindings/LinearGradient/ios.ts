import {LinearGradient} from '@diez/prefabs';
import {IosBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: IosBinding<LinearGradient> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'LinearGradient+Binding.swift'),
  ],
};

export = binding;
