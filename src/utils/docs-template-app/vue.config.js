const DiezWebpackPlugin = require('diez-webpack-plugin');
const {resolve, dirname} = require('path');
const packageJson = require('./package.json');

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
        sdk: 'diez-diez-docs-template-design-language',
        projectPath: resolve(dirname(require.resolve('@diez/docs-template-design-language')), '..', '..'),
      }),
    ],
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
  },
};
