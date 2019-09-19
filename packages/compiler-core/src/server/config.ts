import {join, relative} from 'path';
import timeFixPlugin from 'time-fix-plugin';
import {Configuration, HotModuleReplacementPlugin} from 'webpack';
import {Parser} from '../api';

/**
 * Provides a hot webpack configuration for projects.
 * @ignore
 */
export const getConfiguration = (parser: Parser, componentEntry: string): Configuration => ({
  entry: {
    component: [
      componentEntry,
    ],
  },
  context: parser.hotRoot,
  mode: 'development',
  resolve: {
    alias: {
      '@': relative(__dirname, parser.hotRoot),
    },
  },
  output: {
    path: join(parser.projectRoot, 'dist'),
    filename: '[name].js',
    publicPath : '/',
  },
  devtool: 'source-map',
  plugins: [
    new HotModuleReplacementPlugin(),
    new timeFixPlugin(),
  ],
});
