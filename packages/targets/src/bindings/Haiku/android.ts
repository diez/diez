import {Haiku} from '@diez/designsystem';
import {join} from 'path';
import {haikuAssetBinder} from '../../asset-binders/haiku';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Haiku> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Haiku.kt')],
  imports: [
    'android.annotation.SuppressLint',
    'android.graphics.Color as CoreColor',
    'android.view.ViewGroup',
    'android.webkit.WebView',
    'android.widget.FrameLayout',
  ],
  initializer: (instance) => `Haiku("${instance.component}")`,
  assetsBinder: haikuAssetBinder,
};

export = binding;
