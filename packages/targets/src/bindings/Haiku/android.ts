import {Haiku} from '@diez/designsystem';
import {join} from 'path';
import {haikuAssetBinder} from '../../asset-binders/haiku';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Haiku> = {
  sources: [
    join(sourcesPath, 'android', 'bindings', 'File.kt'),
    join(sourcesPath, 'android', 'bindings', 'Haiku.kt'),
  ],
  assetsBinder: haikuAssetBinder,
};

export = binding;
