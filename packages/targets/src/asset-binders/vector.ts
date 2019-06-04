import {AssetBinder} from '@diez/compiler';
import {Vector} from '@diez/prefabs';
import {readFile} from 'fs-extra';
import {compile} from 'handlebars';
import {join} from 'path';
import {templateRoot} from '.';

/**
 * An asset binder for the Vector prefab.
 *
 * Given a Diez Vector component instance, registers an asset at the original location containing a mobile-friendly
 * Vector (wrapped as an HTML file). This facilitates cross-platform rendering on non-web platforms where Vector is not
 * natively supported.
 */
export const vectorAssetBinder: AssetBinder<Vector> = async (instance, {projectRoot}, {assetBindings}) =>
  new Promise((resolve, reject) => {
    readFile(join(projectRoot, instance.src), (vectorError, vectorContentsBuffer) => {
      if (vectorError) {
        return reject(vectorError);
      }

      readFile(join(templateRoot, 'vector.handlebars'), (templateError, templateContentsBuffer) => {
        if (templateError) {
          return reject(templateError);
        }

        assetBindings.set(
          `${instance.src}.html`,
          {
            contents: compile(templateContentsBuffer.toString())({vectorContents: vectorContentsBuffer.toString()}),
          },
        );

        resolve();
      });
    });
  });
