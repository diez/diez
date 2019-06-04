import {Vector} from '@diez/prefabs';
import {join} from 'path';
import {vectorAssetBinder} from '../../asset-binders/vector';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Vector> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Bundle+File.swift'),
    join(sourcesPath, 'ios', 'bindings', 'File.swift'),
    join(sourcesPath, 'ios', 'bindings', 'Vector.swift'),
    join(sourcesPath, 'ios', 'bindings', 'VectorView.swift'),
  ],
  imports: ['UIKit', 'WebKit'],
  assetsBinder: vectorAssetBinder,
};

export = binding;
