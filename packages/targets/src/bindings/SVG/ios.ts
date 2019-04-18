import {encodeFileSource, SVG} from '@diez/designsystem';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {svgAssetBinder} from '../../asset-binders/svg';
import {sourcesPath} from '../../utils';

const binding: IosBinding<SVG> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'SVG.swift')],
  imports: ['UIKit', 'WebKit'],
  updateable: true,
  initializer: (instance) =>
    `SVG(withSrc: "${encodeFileSource(instance.src)}")`,
  assetsBinder: svgAssetBinder,
};

export = binding;
