import {encodeFileSource, File} from '@diez/designsystem';
import {join} from 'path';
import {fileAssetBinder} from '../../asset-binders/file';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<File> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'File.swift')],
  imports: ['Foundation'],
  updateable: true,
  initializer: (instance) => `File(src: "${encodeFileSource(instance.src)}")`,
  assetsBinder: fileAssetBinder,
};

export = binding;
