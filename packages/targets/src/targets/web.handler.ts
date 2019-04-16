import {CompilerTargetHandler, getHotPort, serveHot} from '@diez/compiler';

/**
 * The canonical Web compiler target implementation.
 */
export const webHandler: CompilerTargetHandler = async (
  projectRoot,
  destinationPath,
  localComponentNames,
  namedComponentMap,
  devMode,
) => {
  if (devMode) {
    const devPort = await getHotPort();
    await serveHot(
      projectRoot,
      require.resolve('@diez/targets/lib/web/web.component'),
      devPort,
      'TODO',
    );
    // TODO: write SDK in dev mode.
    // TODO: watch for hot updates and update the SDK when things change.
    // TODO: when we shut down, compile once in prod mode.
  } else {
    // TODO: write SDK in prod mode.
  }
};
