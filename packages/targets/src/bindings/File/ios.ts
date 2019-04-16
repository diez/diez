import {encodeFileSource, File} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../api';
import {sourcesPath} from '../../utils';

const binding: IosBinding = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'File.swift')],
  imports: ['Foundation'],
  updateable: true,
  initializer: (instance: File) => `File(withSrc: "${encodeFileSource(instance.src)}")`,
};

export = binding;
