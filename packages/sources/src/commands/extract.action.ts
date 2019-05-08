import {findPlugins, info, warning} from '@diez/cli-core';
import {queue} from 'async';
import {watch} from 'chokidar';
import {readdirSync} from 'fs-extra';
import {join, resolve} from 'path';
import {ExporterInput} from '../api';
import {performExtraction} from '../exporters';

interface DesignSources {
  sources: string;
  assets: string;
  code: string;
  services: string[];
}

interface SyncOptions {
  hot?: boolean;
}

declare module '@diez/cli-core/types/api' {
  /**
   * Extends FullDiezConfiguration for the sync mechanism.
   */
  export interface FullDiezConfiguration {
    designs: Partial<DesignSources>;
  }
}

const defaultConfiguration: DesignSources = {
  sources: './designs',
  assets: './assets',
  code: './src/designs',
  services: [],
};

const syncQueue = queue<ExporterInput>(async (input, callback) => {
  try {
    await performExtraction(input, global.process.cwd());
  } catch (error) {
    warning(error);
  } finally {
    callback();
  }
});

/**
 * The entry point for syncing.
 * @ignore
 */
export const syncAction = async ({hot}: SyncOptions) => {
  const rawConfiguration = (await findPlugins()).get('.');
  const configuration: DesignSources = {
    ...defaultConfiguration,
    ...(rawConfiguration ? rawConfiguration.designs : undefined),
  };

  const projectRoot = global.process.cwd();
  configuration.sources = resolve(projectRoot, configuration.sources);
  configuration.assets = resolve(projectRoot, configuration.assets);
  configuration.code = resolve(projectRoot, configuration.code);

  const sources = readdirSync(configuration.sources)
    .map((designFile) => join(configuration.sources, designFile))
    .concat(configuration.services);

  await Promise.all(sources.map((source) => {
    try {
      return performExtraction(
        {
          source,
          assets: configuration.assets,
          code: configuration.code,
        },
        projectRoot,
      );
    } catch (error) {
      warning(error);
      return;
    }
  }));

  if (hot) {
    info(`Watching ${configuration.sources} for changes…`);
    const watcher = watch(configuration.sources, {
      persistent: true,
      ignoreInitial: true,
    });

    watcher.on('add', async (source) => {
      syncQueue.push({
        source,
        assets: configuration.assets,
        code: configuration.code,
      });
    });

    watcher.on('change', async (source) => {
      syncQueue.push({
        source,
        assets: configuration.assets,
        code: configuration.code,
      });
    });
  }
};
