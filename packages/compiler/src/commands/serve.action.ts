import {findPlugins, info} from '@livedesigner/cli';
import express, {Express} from 'express';
import expressHandlebars from 'express-handlebars';
import {join, resolve} from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import {TemplateProvider} from '../api';
import {getConfiguration} from '../server/config';

const registerWithProvider = (app: Express, projectRoot: string, provider: TemplateProvider) => {
  app.get(provider.path, provider.factory(projectRoot));
};

/**
 * The serve action starts a hot server for a live design session.
 *
 * Eventually, this action should be retired in favor of `diez compile --dev`.
 */
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

  for (const [plugin, config] of await findPlugins()) {
    if (!config.compiler || !config.compiler.templateProviders) {
      continue;
    }

    for (const path of config.compiler.templateProviders) {
      registerWithProvider(app, projectRoot, require(join(plugin, path)));
    }
  }

  // TODO: should this be configured or always a magic directory called "assets"?
  app.use('/assets', express.static(resolve(projectRoot, 'assets')));

  // TODO: get an open port programatically.
  const port = 8081;
  app.listen(port, () => {
    info(`Serving hot on port ${port}.`);
  });
};
