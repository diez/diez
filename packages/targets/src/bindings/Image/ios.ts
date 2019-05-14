import {Image} from '@diez/prefabs';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Image> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Image.swift')],
  imports: ['UIKit'],
};

export = binding;
