import {TextStyle} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<TextStyle> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'TextStyle.swift')],
  imports: ['UIKit'],
};

export = binding;
