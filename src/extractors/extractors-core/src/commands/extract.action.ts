import {exitTrap, findPlugins, Format, Log, socketTrap} from '@diez/cli-core';
import {getHotPort, getProjectRoot} from '@diez/compiler-core';
import {queue} from 'async';
import {watch} from 'chokidar';
import {ensureDirSync, existsSync, readdirSync, removeSync, writeFileSync} from 'fs-extra';
import {createServer, Socket} from 'net';
import {basename, join, resolve} from 'path';
import readline from 'readline';
import {DesignSources, ExtractorInput} from '../api';
import {performExtraction} from '../utils';

interface SyncOptions {
  hot?: boolean;
}

const defaultConfiguration: DesignSources = {
  sources: './designs',
  assets: './assets',
  code: './src/designs',
  services: [],
};

const ignoredFiles = new Set(['.gitkeep']);

const syncQueue = queue<ExtractorInput & {sockets: Iterable<Socket>}>(async (input, callback) => {
  try {
    await performExtraction(input, global.process.cwd());
    for (const socket of input.sockets) {
      socket.write(JSON.stringify({event: 'reload'}));
    }
  } catch (error) {
    Log.warning(error);
  } finally {
    callback();
  }
});

export = async ({hot}: SyncOptions) => {
  const rawConfiguration = (await findPlugins()).get('.');
  const configuration: DesignSources = {
    ...defaultConfiguration,
    ...(rawConfiguration ? rawConfiguration.designs : undefined),
  };

  const projectRoot = await getProjectRoot();
  configuration.sources = resolve(projectRoot, configuration.sources);
  configuration.assets = resolve(projectRoot, configuration.assets);
  configuration.code = resolve(projectRoot, configuration.code);

  ensureDirSync(configuration.sources);
  const sources = readdirSync(configuration.sources)
    .map((designFile) => join(configuration.sources, designFile))
    .filter((designFile) => !ignoredFiles.has(basename(designFile)))
    .concat(configuration.services);

  await Promise.all(sources.map(async (source) => {
    try {
      await performExtraction(
        {
          source,
          assets: configuration.assets,
          code: configuration.code,
        },
        projectRoot,
      );
    } catch (error) {
      Log.warning(error);
      return;
    }
  }));

  if (hot) {
    const hotMutex = join(global.process.cwd(), '.diez', 'extract-port');
    if (existsSync(hotMutex)) {
      throw new Error(
        `Found existing hot extraction mutex at ${hotMutex}. If this is an error, please manually remove the file.`,
      );
    }

    const sockets: Socket[] = [];

    const watcher = watch(configuration.sources, {
      useFsEvents: false,
      ignoreInitial: true,
    });

    exitTrap(() => {
      watcher.close();
    });

    Log.info(`Watching ${Format.code(configuration.sources)} for changes...`);
    if (configuration.services.length) {
      Log.info(`Press ${Format.code('r')} to refresh design services...`);
    }

    const stdin = process.stdin;
    if (stdin && stdin.setRawMode) {
      readline.emitKeypressEvents(stdin);
      stdin.setRawMode(true);
      stdin.on('keypress', (key, data) => {
        if (key === 'r') {
          return syncQueue.push(configuration.services.map((source) => ({
            sockets,
            source,
            assets: configuration.assets,
            code: configuration.code,
          })));
        }

        if (data.name === 'c' && data.ctrl) {
          process.exit();
        }
      });
    }

    watcher.on('all', (eventName, source) => {
      if (eventName !== 'add' && eventName !== 'change') {
        return;
      }

      syncQueue.push({
        sockets,
        source,
        assets: configuration.assets,
        code: configuration.code,
      });
    });

    const port = await getHotPort();
    const server = createServer((socket) => {
      socketTrap(socket);
      sockets.push(socket);
    });

    server.listen(port, '0.0.0.0', () => {
      exitTrap(() => {
        removeSync(hotMutex);
        server.close();
        for (const socket of sockets) {
          socket.destroy();
        }
        process.exit(0);
      });
      writeFileSync(hotMutex, port);
      Log.info(`Serving hot assets on port ${port}.`);
    });
  }
};
