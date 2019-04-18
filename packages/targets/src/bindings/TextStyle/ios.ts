import {TextStyle} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';
import {initializer as colorInitializer} from '../Color/ios';

const binding: IosBinding<TextStyle> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'TextStyle.swift')],
  imports: ['UIKit'],
  updateable: true,
  initializer: (instance) =>
    `TextStyle(fontName: "${instance.font}", fontSize: ${instance.fontSize}, ` +
    `color: ${colorInitializer!(instance.color)})`,
};

export = binding;
