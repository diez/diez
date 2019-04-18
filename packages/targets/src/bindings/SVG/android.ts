import {encodeFileSource, SVG} from '@diez/designsystem';
import {join} from 'path';
import {svgAssetBinder} from '../../asset-binders/svg';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<SVG> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'SVG.kt')],
  imports: [
    'android.graphics.Color as CoreColor',
    'android.view.ViewGroup',
    'android.webkit.WebView',
    'android.widget.FrameLayout',
  ],
  initializer: (instance) =>
    `SVG("${encodeFileSource(instance.src)}")`,
  assetsBinder: svgAssetBinder,
};

export = binding;
