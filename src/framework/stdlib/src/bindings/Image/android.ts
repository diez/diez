import {File, Image} from '@diez/prefabs';
import {AndroidBinding, AndroidLanguages} from '@diez/targets';
import {join} from 'path';
import {portAssetBindingToResource, sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'android', 'examples', 'Image');

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
  examples: [
    {
      example: 'ImageView',
      snippets: [
        {
          lang: AndroidLanguages.Kotlin,
          templatePath: join(examplesPath, 'ImageView.kotlin.handlebars'),
        },
        {
          lang: AndroidLanguages.Java,
          templatePath: join(examplesPath, 'ImageView.java.handlebars'),
        },
      ],
    },
    {
      example: 'View',
      snippets: [
        {
          lang: AndroidLanguages.Kotlin,
          templatePath: join(examplesPath, 'View.kotlin.handlebars'),
        },
        {
          lang: AndroidLanguages.Java,
          templatePath: join(examplesPath, 'View.java.handlebars'),
        },
      ],
    },
    {
      example: 'TextView',
      snippets: [
        {
          lang: AndroidLanguages.Kotlin,
          templatePath: join(examplesPath, 'TextView.kotlin.handlebars'),
        },
        {
          lang: AndroidLanguages.Java,
          templatePath: join(examplesPath, 'TextView.java.handlebars'),
        },
      ],
    },
    {
      example: 'Toolbar',
      snippets: [
        {
          lang: AndroidLanguages.Kotlin,
          templatePath: join(examplesPath, 'Toolbar.kotlin.handlebars'),
        },
        {
          lang: AndroidLanguages.Java,
          templatePath: join(examplesPath, 'Toolbar.java.handlebars'),
        },
      ],
    },
  ],
};

export = binding;
