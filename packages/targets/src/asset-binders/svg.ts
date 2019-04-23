import {AssetBinder} from '@diez/compiler';
import {SVG} from '@diez/designsystem';
import {readFile} from 'fs-extra';
import {compile} from 'handlebars';
import {join} from 'path';
import {templateRoot} from '.';

/**
 * An asset binder for the SVG prefab.
 *
 * Given a Diez SVG component instance, registers an asset at the original location containing a mobile-friendly
 * SVG (wrapped as an HTML file).
 */
export const svgAssetBinder: AssetBinder<SVG> = async (instance, projectRoot, {assetBindings}) =>
  new Promise((resolve, reject) => {
    readFile(join(projectRoot, instance.src), (svgError, svgContentsBuffer) => {
      if (svgError) {
        return reject(svgError);
      }

      readFile(join(templateRoot, 'svg.handlebars'), (templateError, templateContentsBuffer) => {
        if (templateError) {
          return reject(templateError);
        }

        assetBindings.set(
          `${instance.src}.html`,
          {
            contents: compile(templateContentsBuffer.toString())({svgContents: svgContentsBuffer.toString()}),
          },
        );

        resolve();
      });
    });
  });
