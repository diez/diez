import {SVG} from '@diez/prefabs';
import {join} from 'path';
import {svgAssetBinder} from '../../asset-binders/svg';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<SVG> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Bundle+File.swift'),
    join(sourcesPath, 'ios', 'bindings', 'File.swift'),
    join(sourcesPath, 'ios', 'bindings', 'SVG.swift'),
    join(sourcesPath, 'ios', 'bindings', 'SVGView.swift'),
  ],
  imports: ['UIKit', 'WebKit'],
  assetsBinder: svgAssetBinder,
};

export = binding;
