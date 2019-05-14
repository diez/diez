import {FontRegistry} from '@diez/prefabs';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<FontRegistry> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'FontRegistry.swift')],
  imports: ['UIKit'],
  skipGeneration: true,
};

export = binding;
