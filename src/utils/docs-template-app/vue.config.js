const DiezWebpackPlugin = require('diez-webpack-plugin');
const {resolve, dirname} = require('path');

module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        config: {
          path: './',
        },
      },
    },
  },
  configureWebpack: {
    plugins: [
      new DiezWebpackPlugin({
        sdk: 'diez-diez-docs-design-language',
        projectPath: resolve(dirname(require.resolve('@diez/docs-design-language')), '..', '..'),
      }),
    ],
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
  },
};
