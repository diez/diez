import {Point2D} from '@diez/prefabs';
import {WebBinding} from '../../targets/web.api';

const binding: WebBinding<Point2D> = {
  // TODO: Remove the need to provide an empty binding on prefabs without any binding overrides.
  // Provide an empty array to prevent this prefab from being treated as a singleton.
  sources: [],
};

export = binding;
