import {File} from '@diez/designsystem';
import {exists} from 'fs-extra';
import {join} from 'path';
import {AssetBinder} from '../api';

/**
 * An simple copy asset binder for the File prefab.
 */
export const fileAssetBinder: AssetBinder<File> = async (instance, projectRoot, bindings) =>
  new Promise((resolve, reject) => {
    const source = join(projectRoot, instance.src);
    exists(source, (fileExists) => {
      if (!fileExists) {
        return reject(new Error(`File at ${source} does not exist.`));
      }

      bindings.set(
        instance.src,
        {
          contents: source,
          copy: true,
        },
      );

      resolve();
    });
  });
