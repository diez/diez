const CopyWebpackPlugin = require('copy-webpack-plugin');
const {existsSync, readFileSync} = require('fs');
const {join} = require('path');
const {DefinePlugin} = require('webpack');

const hotFilePath = join(__dirname, '..', '.diez', 'web-hot-url');

module.exports = {
  configureWebpack: (config) => {
    if (config.mode === 'production' || !existsSync(hotFilePath)) {
      config.plugins.push(
        new CopyWebpackPlugin([{
          from: join(__dirname, '..', 'build', 'diez-playground-web', 'static'),
          to: join(__dirname, 'public', 'diez'),
        }]),
        new DefinePlugin({
          'process.env.DIEZ_SERVER_URL': JSON.stringify('/diez'),
        }),
      );

      return;
    }

    config.plugins.push(new DefinePlugin({
      'process.env.DIEZ_IS_HOT': JSON.stringify(true),
      'process.env.DIEZ_SERVER_URL': JSON.stringify(readFileSync(hotFilePath).toString().trim()),
    }));
  },
};
