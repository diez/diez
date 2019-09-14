import {Panel} from '@diez/prefabs';
import {IosBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Panel> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Panel+Binding.swift'),
  ],
};

export = binding;
