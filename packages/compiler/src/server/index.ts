import {exitTrap, Log, socketTrap} from '@diez/cli-core';
import {watch} from 'chokidar';
import cors from 'cors';
import debounce from 'debounce';
import express from 'express';
import expressHandlebars from 'express-handlebars';
import {readFileSync} from 'fs-extra';
import {createConnection} from 'net';
import {join, resolve} from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import {CompilerProgram} from '../api';
import {getConfiguration} from './config';

/**
 * Starts a hot server at the project root.
 *
 *
 * @param projectRoot - The root of the project.
 * @param componentEntry - The path to the module that we should serve at /component.js.
 * @param port - The port on which we should serve hot.
 * @param modifyServer - Enables optional runtime forking of the server configuration before it begins to listen.
 * @param modifyWebpackConfig - Enables optional runtime forking of the Webpack configuration before it is applied.
 */
export const serveHot = async (
  program: CompilerProgram,
  componentEntry: string,
  port: number,
  staticRoot: string,
) => {
  const app = express();
  app.set('views', resolve(__dirname, '..', '..', 'views'));

  app.get('/components/:componentName', (request, response) => {
    const {componentName} = request.params;
    response.render('component', {componentName, layout: false});
  });

  const webpackConfig = getConfiguration(program, componentEntry);
  const compiler = webpack(webpackConfig);

  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: '',
    logLevel: 'warn',
  });

  const hotMiddleware = webpackHotMiddleware(compiler, {log: false});

  const hotExtractMutex = join(program.projectRoot, '.diez', 'extract-port');
  const watcher = watch(hotExtractMutex, {useFsEvents: false});
  exitTrap(() => {
    watcher.close();
  });

  const debouncedReload = debounce(() => {
    Log.info('Reloading assets...');
    hotMiddleware.publish({reload: true});
  }, 500);

  watcher.on('add', () => {
    const assetPort = Number(readFileSync(hotExtractMutex));
    const socket = createConnection(assetPort, '0.0.0.0', () => {
      Log.info(`Receiving hot assets on port ${assetPort}.`);
    });

    socket.setEncoding('utf8');
    socketTrap(socket);

    socket.on('data', (data) => {
      const {event} = JSON.parse(data.toString());
      if (event === 'reload') {
        debouncedReload();
      }
    });
  });

  app.use(devMiddleware);
  app.use(hotMiddleware);

  let lastHash = '';
  compiler.hooks.done.tap('@diez/compiler', ({hash, endTime}) => {
    // istanbul ignore if
    if (!hash || !endTime) {
      // This should never happen.
      return;
    }

    if (lastHash !== hash) {
      const buildTime = endTime - program.hotBuildStartTime;
      Log.info(`Built in ${buildTime}ms.`);
      if (process.send) {
        process.send('built');
      }
      lastHash = hash;
    }
  });

  app.use(cors());

  app.engine('handlebars', expressHandlebars());
  app.set('view engine', 'handlebars');

  app.use(express.static(staticRoot));

  // TODO: get an open port programatically.
  app.listen(port, () => {
    Log.info(`Serving hot on port ${port}.`);
  });
};
