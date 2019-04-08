import {CompilerTargetHandler, NamedComponentMap} from '@livedesigner/compiler';

/**
 * The canonical Android compiler target implementation.
 */
export const androidHandler: CompilerTargetHandler = (
  projectRoot: string,
  destinationPath: string,
  localComponentNames: string[],
  namedComponentMap: NamedComponentMap,
) => {
  console.log(projectRoot, destinationPath, localComponentNames, namedComponentMap);
};
