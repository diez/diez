import {DropShadow} from '@diez/prefabs';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<DropShadow> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'DropShadow+Binding.swift'),
  ],
};

export = binding;
