import {FontRegistry} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/ios';

const binding: IosBinding = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'FontRegistry.swift')],
  imports: ['UIKit'],
  updateable: true,
  initializer: (instance: FontRegistry) => `FontRegistry(withFiles: [
${instance.files.map((file) => `            ${fileInitializer!(file)},`).join('\n')}
        ])`,
};

export = binding;
