import {join, relative} from 'path';
import {Configuration, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin} from 'webpack';

export const getConfiguration = (projectRoot: string): Configuration => ({
  entry: {
    component: [
      'webpack-hot-middleware/client',
      require.resolve('@livedesigner/compiler/lib/server/component'),
    ],
    // others…
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
      '@': join(relative(__dirname, projectRoot), 'components'),
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
