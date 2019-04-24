import {File} from '@diez/designsystem';
import {join} from 'path';
import {fileAssetBinder} from '../../asset-binders/file';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<File> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Bundle+File.swift'),
    join(sourcesPath, 'ios', 'bindings', 'File.swift'),
  ],
  imports: ['Foundation'],
  assetsBinder: fileAssetBinder,
};

export = binding;
