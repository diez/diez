import {info} from '@livedesigner/cli';
import express from 'express';
import expressHandlebars from 'express-handlebars';
import {resolve} from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import {getConfiguration} from '../server/config';

export const serveAction = async () => {
  const app = express();
  const projectRoot = global.process.cwd();

  const webpackConfig = getConfiguration(projectRoot);
  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/',
  }));
  app.use(webpackHotMiddleware(compiler));

  app.engine('handlebars', expressHandlebars());
  app.set('view engine', 'handlebars');
  app.set('views', resolve(__dirname, '..', '..', 'views'));

  // TODO: should this be configured or always a magic directory called "assets"?
  app.use('/assets', express.static(resolve(projectRoot, 'assets')));

  app.get('/components/:componentName', (request, response) => {
    // TODO: handle missing information.
    const {componentName} = request.params;
    response.render('component', {componentName});
  });

  // TODO: get an open port programatically.
  const port = 8081;
  app.listen(port, () => {
    info(`Serving hot on port ${port}.`);
  });
};
