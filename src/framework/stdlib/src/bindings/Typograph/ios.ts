import {Typograph} from '@diez/prefabs';
import {IosBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Typograph> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Typograph+Binding.swift')],
};

export = binding;
