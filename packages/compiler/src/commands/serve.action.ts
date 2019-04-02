import {info} from '@livedesigner/cli';
import express from 'express';
import expressHandlebars from 'express-handlebars';
import {existsSync, readFile} from 'fs-extra';
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

  app.get('/components/:componentName', (request, response) => {
    // TODO: handle missing information.
    const {componentName} = request.params;
    response.render('component', {componentName});
  });

  // TODO: should packages (e.g. the @livedesigner/designsystem package) yield their own templates and routes?
  app.get('/assets/(*/)?(*.svg)', (request, response) => {
    const svgFile = resolve(projectRoot, 'assets', request.params[0] || '', request.params[1]);
    if (!existsSync(svgFile)) {
      response.status(404);
      return response.end();
    }

    readFile(svgFile, (_, svgContentsBuffer) => {
      response.render('svg', {svgContents: svgContentsBuffer.toString()});
    });
  });

  // TODO: should packages (e.g. the @livedesigner/designsystem package) yield their own templates and routes?
  app.get('/haiku/(*)', (request, response) => {
    let packagePath = '';
    try {
      packagePath = require.resolve(request.params[0]);
    } catch (e) {
      response.status(404);
      return response.end();
    }

    const standandaloneIndexPath = packagePath.replace('index.js', 'index.standalone.js');
    if (!existsSync(standandaloneIndexPath)) {
      response.status(404);
      return response.end();
    }

    readFile(standandaloneIndexPath, (_, standaloneIndexContentBuffer) => {
      const standaloneIndexContent = standaloneIndexContentBuffer.toString();
      const matches = standaloneIndexContent.match(/var (\w+)=/);
      if (!matches) {
        response.status(404);
        return response.end();
      }
      response.render('haiku', {standaloneIndexContent, adapterName: matches[1]});
    });
  });

  // TODO: should this be configured or always a magic directory called "assets"?
  app.use('/assets', express.static(resolve(projectRoot, 'assets')));

  // TODO: get an open port programatically.
  const port = 8081;
  app.listen(port, () => {
    info(`Serving hot on port ${port}.`);
  });
};
