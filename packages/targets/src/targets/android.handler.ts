import {CompilerTargetHandler, getHotPort, serveHot} from '@diez/compiler';
import {outputTemplatePackage} from '@diez/storage/lib';
import {v4} from 'internal-ip';
import {join} from 'path';
import {sourcesPath} from '../utils';

const coreAndroid = join(sourcesPath, 'android');

/**
 * The canonical Android compiler target implementation.
 */
export const androidHandler: CompilerTargetHandler = async (
  projectRoot,
  destinationPath,
  localComponentNames,
  namedComponentMap,
  devMode,
) => {
  if (devMode) {
    const devPort = await getHotPort();
    const tokens = {
      devMode,
      devPort,
      hostname: await v4(),
    };
    outputTemplatePackage(join(coreAndroid, 'sdk'), join(destinationPath, 'diez'), tokens);
    await serveHot(
      projectRoot,
      'android',
      require.resolve('@diez/targets/lib/android/android.component'),
      devPort,
    );
    // TODO: write SDK in dev mode.
    // TODO: watch for hot updates and update the SDK when things change.
    // TODO: when we shut down, compile once in prod mode.
  } else {
    // TODO: write SDK in prod mode.
  }
};
