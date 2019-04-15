import {TextStyle} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../api';
import {sourcesPath} from '../../utils';
import {initializer as colorInitializer} from '../Color/ios';

const binding: IosBinding = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'TextStyle.swift')],
  imports: ['UIKit'],
  updateable: true,
  initializer: (instance: TextStyle) =>
    `TextStyle(withFont: "${instance.font}", withFontSize: ${instance.fontSize}, ` +
    `withColor: ${colorInitializer!(instance.color)})`,
};

export = binding;
