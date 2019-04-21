import {info} from '@diez/cli';
import express from 'express';
import expressHandlebars from 'express-handlebars';
import {resolve} from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import {HotServerModifier, WebpackConfigModifier} from '../api';
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
  projectRoot: string,
  componentEntry: string,
  port: number,
  staticRoot: string,
  modifyServer?: HotServerModifier,
  modifyWebpackConfig?: WebpackConfigModifier,
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

  const webpackConfig = getConfiguration(projectRoot, componentEntry);
  if (modifyWebpackConfig) {
    modifyWebpackConfig(webpackConfig);
  }
  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '',
    logLevel: 'warn',
  }));
  app.use(webpackHotMiddleware(compiler));

  app.engine('handlebars', expressHandlebars());
  app.set('view engine', 'handlebars');

  app.use(express.static(staticRoot));

  // TODO: get an open port programatically.
  app.listen(port, () => {
    info(`Serving hot on port ${port}.`);
  });
};
