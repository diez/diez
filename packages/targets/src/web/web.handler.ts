import {CompilerTargetHandler, NamedComponentMap} from '@diez/compiler';

/**
 * The canonical web compiler target implementation.
 */
export const webHandler: CompilerTargetHandler = (
  projectRoot: string,
  destinationPath: string,
  localComponentNames: string[],
  namedComponentMap: NamedComponentMap,
) => {
  console.log(projectRoot, destinationPath, localComponentNames, namedComponentMap);
};
