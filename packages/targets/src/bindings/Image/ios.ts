import {Image} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/ios';

const binding: IosBinding<Image> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Image.swift')],
  imports: ['UIKit'],
  updateable: true,
  initializer: (instance) =>
    `Image(file: ${fileInitializer!(instance.file)}, width: ${instance.width}, ` +
    `height: ${instance.height}, scale: ${instance.scale})`,
};

export = binding;
