import {FontRegistry} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/ios';

const binding: IosBinding<FontRegistry> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'FontRegistry.swift')],
  imports: ['UIKit'],
  updateable: true,
  initializer: (instance) => `FontRegistry(files: [
${instance.files.map((file) => `            ${fileInitializer!(file)},`).join('\n')}
        ])`,
};

export = binding;
