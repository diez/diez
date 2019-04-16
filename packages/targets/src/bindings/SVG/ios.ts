import {SVG} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/ios';

const binding: IosBinding<SVG> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'SVG.swift')],
  imports: ['UIKit', 'WebKit'],
  updateable: true,
  initializer: (instance) =>
    `SVG(withFile: ${fileInitializer!(instance.file)})`,
};

export = binding;
