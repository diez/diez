import {Panel} from '@diez/prefabs';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Panel> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Panel+Binding.swift'),
  ],
};

export = binding;
