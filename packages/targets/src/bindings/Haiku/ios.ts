import {Haiku} from '@diez/designsystem';
import {join} from 'path';
import {haikuAssetBinder} from '../../asset-binders/haiku';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Haiku> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Haiku.swift'),
    join(sourcesPath, 'ios', 'bindings', 'HaikuView.swift'),
  ],
  imports: ['UIKit.UIView', 'WebKit'],
  updateable: true,
  initializer: (instance) => `Haiku(withComponent: "${instance.component}")`,
  assetsBinder: haikuAssetBinder,
};

export = binding;
