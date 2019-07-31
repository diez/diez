import {DropShadow} from '@diez/prefabs';
import {AndroidBinding} from '../../targets/android.api';

const binding: AndroidBinding<DropShadow> = {
  // TODO: Remove the need to provide an empty binding on prefabs without any binding overrides.
  // Provide an empty array to prevent this prefab from being treated as a singleton.
  sources: [],
};

export = binding;
