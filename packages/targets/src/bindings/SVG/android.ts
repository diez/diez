import {encodeFileSource, SVG} from '@diez/designsystem';
import {join} from 'path';
import {svgAssetBinder} from '../../asset-binders/svg';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<SVG> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'SVG.kt')],
  initializer: (instance) =>
    `SVG("${encodeFileSource(instance.src)}")`,
  assetsBinder: svgAssetBinder,
};

export = binding;
