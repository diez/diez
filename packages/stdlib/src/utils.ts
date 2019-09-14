import {File} from '@diez/prefabs';
import {AndroidOutput, getUnitedStyleSheetVariables, StyleSheet, WebOutput} from '@diez/targets';
import {resolve} from 'path';

/**
 * The root of all native sources provided by this package.
 * @ignore
 */
export const sourcesPath = resolve(__dirname, '..', 'sources');

/**
 * Sets the provided variable along with its united variants on the style sheet.
 */
export const updateStyleSheetWithUnitedVariables = (name: string, value: string, styleSheet: StyleSheet) => {
  styleSheet.variables.set(name, value);
  getUnitedStyleSheetVariables(name, value).forEach((variable) => {
    styleSheet.variables.set(variable.name, variable.value);
  });
};

/**
 * Given an File in Diez, returns a resource path for Android.
 *
 * This is achieved by:
 *  - lowercasing
 *  - replacing any non-alphanumeric characters with underscores
 *  - specifically excluding the final dot in the filename to preserve the file extension
 *
 * For example: `'some.directory.name/image@2x.png'` will become `'some_directory_name_image_2x.png'`,
 * and can be used in Android with name `some_directory_name_image_2x`.
 * @internal
 */
const getAndroidResourcePath = (file: File) =>
  encodeURI(file.src).toLowerCase().replace(/([^a-z0-9_\.]|\.(?=[^.]*\.))/g, '_');

/**
 * Migrates a [[File]] prefab's assetbinding to Android resources.
 * @ignore
 */
export const portAssetBindingToResource = (file: File, output: AndroidOutput, type: string, resourceFile?: File) => {
  if (!output.resources.has(type)) {
    output.resources.set(type, new Map());
  }

  const oldBinding = output.assetBindings.get(file.src);
  if (!oldBinding) {
    // This should never happen.
    throw new Error(`Unable to retrieve file binding from ${file.src}.`);
  }

  output.resources.get(type)!.set(getAndroidResourcePath(resourceFile || file), oldBinding);
  output.assetBindings.delete(file.src);
};

/**
 * Returns a qualified CSS URL for a given output and relative path.
 *
 * This method currently assumes that when we do not have a hot URL, static assets will be served in the host
 * application at `/diez`. This detail cannot be guaranteed in every codebase, so further work is required here.
 */
export const getQualifiedCssUrl = (output: WebOutput, relativePath: string) =>
  `url("${output.hotUrl || '/diez'}/${relativePath}")`;
