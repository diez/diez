import {File, Image} from '@diez/prefabs';
import {AndroidBinding} from '@diez/targets';
import {join} from 'path';
import {portAssetBindingToResource, sourcesPath} from '../../utils';

const binding: AndroidBinding<Image> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Image.kt')],
  dependencies: [{
    gradle: {
      name: 'glide',
      minVersion: '4.9.0',
      source: 'com.github.bumptech.glide:glide',
    },
  }],
  assetsBinder: async (instance, {hot}, output, spec) => {
    // We do not need to bind image resources in hot mode.
    if (hot) {
      return;
    }

    const densityMap = new Map<string, File>([
      ['mdpi', instance.file],
      ['xhdpi', instance.file2x],
      ['xxhdpi', instance.file3x],
      ['xxxhdpi', instance.file4x],
    ]);

    for (const [density, file] of densityMap) {
      portAssetBindingToResource(file, output, `drawable-${density}`, instance.file);
    }
  },
};

export = binding;
