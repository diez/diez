import {join, relative} from 'path';
import {Configuration, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin} from 'webpack';

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
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': join(relative(__dirname, projectRoot), 'src'),
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
    new NoEmitOnErrorsPlugin(),
  ],
});
