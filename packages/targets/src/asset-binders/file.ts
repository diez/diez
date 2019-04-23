import {AssetBinder} from '@diez/compiler';
import {File} from '@diez/designsystem';
import {stat} from 'fs-extra';
import {join} from 'path';

/**
 * An simple copy asset binder for the File prefab.
 */
export const fileAssetBinder: AssetBinder<File> = async (instance, projectRoot, {assetBindings}) =>
  new Promise((resolve, reject) => {
    const source = join(projectRoot, instance.src);
    stat(source, (statError, stats) => {
      if (statError || !stats.isFile()) {
        return reject(new Error(`File at ${source} does not exist.`));
      }

      assetBindings.set(
        instance.src,
        {
          contents: source,
          copy: true,
        },
      );

      resolve();
    });
  });
