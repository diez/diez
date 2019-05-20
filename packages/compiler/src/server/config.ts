import {join, relative} from 'path';
import timeFixPlugin from 'time-fix-plugin';
import {Configuration, HotModuleReplacementPlugin} from 'webpack';
import {CompilerProgram} from '../api';

/**
 * Provides a hot webpack configuration for projects.
 * @ignore
 */
export const getConfiguration = (program: CompilerProgram, componentEntry: string): Configuration => ({
  entry: {
    component: [
      'webpack-hot-middleware/client',
      componentEntry,
    ],
  },
  context: program.hotRoot,
  mode: 'development',
  resolve: {
    alias: {
      '@': relative(__dirname, program.hotRoot),
    },
  },
  output: {
    path: join(program.projectRoot, 'dist'),
    filename: '[name].js',
    publicPath : '/',
  },
  devtool: 'source-map',
  plugins: [
    new HotModuleReplacementPlugin(),
    new timeFixPlugin(),
  ],
});
