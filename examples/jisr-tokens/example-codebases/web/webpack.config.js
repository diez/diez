const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const DiezWebpackPlugin = require('diez-webpack-plugin');

const webpackConfig = {
  entry: './src/index.jsx',
  resolve: {symlinks: false},
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
          {loader: 'css-loader', options: {modules: true}},
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
      {from: 'public'},
      {from: '../../design-language/build/diez-lorem-ipsum-web/static', to: 'diez'},
    ]),
    new DiezWebpackPlugin({
      sdk: 'diez-lorem-ipsum',
    }),
  ],
  performance: {hints: false},
  devServer: {
    stats: 'errors-only',
    open: true,
    hot: true,
    watchOptions: {
      poll: 500,
      ignored: ['node_modules/**', '.git/**'],
    },
  },
};

module.exports = webpackConfig;
