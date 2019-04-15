import {findPlugins, info} from '@diez/cli';
import express, {Express} from 'express';
import expressHandlebars from 'express-handlebars';
import {join, resolve} from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import {HandlerProvider, HotServerModifier, WebpackConfigModifier} from '../api';
import {getConfiguration} from './config';

const registerWithProvider = (app: Express, projectRoot: string, provider: HandlerProvider) => {
  app.get(provider.path, provider.factory(projectRoot));
};

/**
 * Starts a hot server at the project root.
 *
 *
 * @param projectRoot - The root of the project.
 * @param targetName - The name of the compiler target, used to resolve custom handlers from .diezrc.
 * @param componentEntry - The path to the module that we should serve at /component.js.
 * @param port - The port on which we should serve hot.
 * @param modifyWebpackConfig - Enables optional runtime forking of the Webpack configuration before it is applied.
 * @param modifyServer - Enables optional runtime forking of the server configuration before it begins to listen.
 */
export const serveHot = async (
  projectRoot: string,
  targetName: string,
  componentEntry: string,
  port: number,
  modifyWebpackConfig?: WebpackConfigModifier,
  modifyServer?: HotServerModifier,
) => {
  const app = express();
  app.set('views', resolve(__dirname, '..', '..', 'views'));
  if (modifyServer) {
    modifyServer(app, projectRoot);
  }

  app.get('/components/:componentName', (request, response) => {
    const {componentName} = request.params;
    response.render('component', {componentName});
  });

  for (const [plugin, {handlers}] of await findPlugins()) {
    if (!handlers || !handlers[targetName]) {
      continue;
    }

    for (const path of handlers[targetName]) {
      registerWithProvider(app, projectRoot, require(join(plugin, path)));
    }
  }

  const webpackConfig = getConfiguration(projectRoot, componentEntry);
  if (modifyWebpackConfig) {
    modifyWebpackConfig(webpackConfig);
  }
  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/',
    logLevel: 'warn',
  }));
  app.use(webpackHotMiddleware(compiler));

  app.engine('handlebars', expressHandlebars());
  app.set('view engine', 'handlebars');

  // TODO: should this be configured or always a magic directory called "assets"?
  app.use('/assets', express.static(resolve(projectRoot, 'assets')));

  // TODO: get an open port programatically.
  app.listen(port, () => {
    info(`Serving hot on port ${port}.`);
  });
};
