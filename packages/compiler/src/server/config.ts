import {join, relative} from 'path';
import {Configuration, HotModuleReplacementPlugin} from 'webpack';

/**
 * Provides a hot webpack configuration for projects.
 * @param projectRoot
 */
export const getConfiguration = (projectRoot: string, componentEntry: string): Configuration => ({
  entry: {
    component: [
      'webpack-hot-middleware/client',
      componentEntry,
    ],
  },
  context: projectRoot,
  mode: 'development',
  resolve: {
    alias: {
      '@': join(relative(__dirname, projectRoot), '.diez'),
    },
  },
  output: {
    path: join(projectRoot, 'dist'),
    filename: '[name].js',
    publicPath : '/',
  },
  devtool: 'source-map',
  plugins: [
    new HotModuleReplacementPlugin(),
  ],
});
