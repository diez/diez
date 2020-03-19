const DiezWebpackPlugin = require('diez-webpack-plugin');
const {resolve, dirname} = require('path');
const packageJson = require('./package.json');
const nodeExternals = require('webpack-node-externals');

const devDeps = Object.keys(packageJson.devDependencies);

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
    module: {
      noParse: /\@sentry|reporting\.js|compiler-core|default\-gateway/
    },
    // externals: [
    //   nodeExternals(),
    //   nodeExternals({
    //     modulesFromFile: true,
    //     modulesDir: resolve(__dirname, '../../../node_modules/'),
    //   }),
    // ],
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
