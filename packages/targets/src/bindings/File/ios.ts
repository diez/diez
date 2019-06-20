import {File} from '@diez/prefabs';
import {join} from 'path';
import {fileAssetBinder} from '../../asset-binders/file';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<File> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'File+Binding.swift'),
    join(sourcesPath, 'ios', 'bindings', 'Bundle+File.swift'),
  ],
  assetsBinder: fileAssetBinder,
};

export = binding;
