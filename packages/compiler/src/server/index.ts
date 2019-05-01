import {info} from '@diez/cli-core';
import cors from 'cors';
import express from 'express';
import expressHandlebars from 'express-handlebars';
import {resolve} from 'path';
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
    response.render('component', {componentName});
  });

  const webpackConfig = getConfiguration(program, componentEntry);
  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '',
    logLevel: 'warn',
  }));

  app.use(webpackHotMiddleware(compiler, {log: false}));

  let lastHash = '';
  compiler.hooks.done.tap('@diez/compiler', ({hash, endTime}) => {
    if (!hash || !endTime) {
      return;
    }

    if (lastHash !== hash) {
      const buildTime = endTime - program.hotBuildStartTime;
      info(`Built in ${buildTime}ms.`);
      lastHash = hash;
    }
  });

  app.use(cors());

  app.engine('handlebars', expressHandlebars());
  app.set('view engine', 'handlebars');

  app.use(express.static(staticRoot));

  // TODO: get an open port programatically.
  app.listen(port, () => {
    info(`Serving hot on port ${port}.`);
  });
};
