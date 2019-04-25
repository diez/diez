import {SVG} from '@diez/designsystem';
import {join} from 'path';
import {svgAssetBinder} from '../../asset-binders/svg';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<SVG> = {
  sources: [
    join(sourcesPath, 'android', 'bindings', 'File.kt'),
    join(sourcesPath, 'android', 'bindings', 'SVG.kt'),
  ],
  assetsBinder: svgAssetBinder,
};

export = binding;
