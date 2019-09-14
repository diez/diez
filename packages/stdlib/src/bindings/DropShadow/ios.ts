import {DropShadow} from '@diez/prefabs';
import {IosBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: IosBinding<DropShadow> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'DropShadow+Binding.swift'),
  ],
};

export = binding;
