import {File} from '@diez/prefabs';
import {IosBinding} from '@diez/targets';
import {join} from 'path';
import {fileAssetBinder} from '../../asset-binders/file';
import {sourcesPath} from '../../utils';

const binding: IosBinding<File> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'File+Binding.swift'),
    join(sourcesPath, 'ios', 'bindings', 'Bundle+File.swift'),
  ],
  assetsBinder: fileAssetBinder,
};

export = binding;
