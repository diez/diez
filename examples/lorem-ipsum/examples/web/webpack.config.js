const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const {existsSync, readFileSync} = require('fs');
const {join, resolve} = require('path');
const {DefinePlugin} = require('webpack');

const diezProject = resolve(__dirname, '..', '..');
const hotFilePath = join(diezProject, '.diez', 'web-hot-url');

const webpackConfig = {
  entry: './src/index.jsx',
  resolve: {
    symlinks: false,
    alias: {
      '@diez': existsSync(hotFilePath)
        ? join(diezProject, '.diez', 'web-assets')
        : join(diezProject, 'build', 'diez-lorem-ipsum-web', 'static'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true } },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new CopyWebpackPlugin([
      { from: 'public' },
      { from: 'public/diez', to: 'diez' },
    ]),
  ],
  performance: { hints: false },
  devServer: { stats: 'errors-only', open: true },
};

if (existsSync(hotFilePath)) {
  const hotUrl = readFileSync(hotFilePath).toString().trim();
  console.warn(`Enabling hot mode with URL: ${hotUrl}`);
  webpackConfig.plugins.push(new DefinePlugin({
    'process.env.DIEZ_IS_HOT': JSON.stringify(true),
    'process.env.DIEZ_SERVER_URL': JSON.stringify(hotUrl),
  }));
}

module.exports = webpackConfig;
