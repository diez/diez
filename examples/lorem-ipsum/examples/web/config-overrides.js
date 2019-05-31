const CopyWebpackPlugin = require('copy-webpack-plugin');
const {join} = require('path');
const {DefinePlugin} = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

module.exports = function override(config, env) {
  config.plugins.push(
    new CopyWebpackPlugin([{
      from: join(__dirname, '..', '..', 'build', 'diez-lorem-ipsum-web', 'static'),
      to: join(__dirname, 'public', 'diez'),
    }]),
    new DefinePlugin({
      'process.env.DIEZ_SERVER_URL': JSON.stringify('/diez'),
    }),
    new WriteFileWebpackPlugin(),
  );

  config.output.futureEmitAssets = false;

  return config;
}
