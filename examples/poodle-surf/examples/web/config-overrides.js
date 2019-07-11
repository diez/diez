const CopyWebpackPlugin = require('copy-webpack-plugin');
const {existsSync} = require('fs');
const {join} = require('path');
const DiezWebpackPlugin = require('diez-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

const hotFilePath = join(__dirname, '..', '..', '.diez', 'web-hot-url');

module.exports = function override(config, env) {
  if (env === 'production' || !existsSync(hotFilePath)) {
    config.plugins.push(
      new CopyWebpackPlugin([{
        from: join(__dirname, '..', '..', 'build', 'diez-poodle-surf-web', 'static'),
        to: join(__dirname, 'public', 'diez'),
      }]),
      new WriteFileWebpackPlugin(),
    );

    config.output.futureEmitAssets = false;

    return config;
  }

  config.plugins.push(new DiezWebpackPlugin({sdk: 'diez-poodle-surf'}));

  return config;
}
