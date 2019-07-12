import {LinearGradient} from '@diez/prefabs';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<LinearGradient> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'LinearGradient+Binding.swift'),
  ],
};

export = binding;
