import {Image} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/ios';

const binding: IosBinding<Image> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Image.swift')],
  imports: ['UIKit'],
  updateable: true,
  initializer: (instance) =>
    `Image(withFile: ${fileInitializer!(instance.file)}, withWidth: ${instance.width}, ` +
    `withHeight: ${instance.height}, withScale: ${instance.scale})`,
};

export = binding;
