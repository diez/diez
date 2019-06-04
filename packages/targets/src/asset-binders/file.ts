import {AssetBinder} from '@diez/compiler';
import {File, FileType} from '@diez/prefabs';
import {stat} from 'fs-extra';
import {extname, join} from 'path';

/**
 * An simple "copy asset" binder for the File prefab.
 */
export const fileAssetBinder: AssetBinder<File> = async (instance, {projectRoot}, {assetBindings}) =>
  new Promise((resolve, reject) => {
    // We only support .ttf files (for now). The best way to remove this restriction would be for `FontRegistry` to be
    // refactored to list a complex `Font` type, including:
    //  - a file
    //  - a list of the PostScript names provided by that font
    //
    // We may or may not want to refactor `Typograph` to run off this `Font` type; the main challenge stems from the
    // need to reference a specific font by name inside a font collection (e.g. a `.ttc` file).
    const extension = extname(instance.src);
    if (instance.type === FileType.Font && extension !== '.ttf') {
      return reject(new Error(`Invalid font file type: ${extension}.`));
    }

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
