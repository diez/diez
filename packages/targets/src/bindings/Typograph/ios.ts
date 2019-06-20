import {Typograph} from '@diez/prefabs';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Typograph> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Typograph+Binding.swift')],
};

export = binding;
