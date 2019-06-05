const CopyWebpackPlugin = require('copy-webpack-plugin');
const {existsSync, readFileSync} = require('fs');
const {join} = require('path');
const {DefinePlugin} = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

const hotFilePath = join(__dirname, '..', '.diez', 'web-hot-url');

module.exports = function override(config, env) {
  if (env === 'production' || !existsSync(hotFilePath)) {
    config.plugins.push(
      new CopyWebpackPlugin([{
        from: join(__dirname, '..', 'build', 'diez-poodle-surf-web', 'static'),
        to: join(__dirname, 'public', 'diez'),
      }]),
      new WriteFileWebpackPlugin(),
    );

    config.output.futureEmitAssets = false;

    return config;
  }

  config.plugins.push(new DefinePlugin({
    'process.env.DIEZ_IS_HOT': JSON.stringify(true),
    'process.env.DIEZ_SERVER_URL': JSON.stringify(readFileSync(hotFilePath).toString().trim()),
  }));
  return config;
}
