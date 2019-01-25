const {resolve} = require('path');
const express = require('express');

module.exports = {
  entry: {
    main: './src/devserver.ts',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: resolve(__dirname, 'node_modules'),
        use: ['awesome-typescript-loader'],
      },
    ],
  },
  resolve: {
    modules: [
      __dirname,
      resolve(__dirname, 'src'),
      'node_modules',
    ],
    extensions: ['.ts', '.js'],
  },
  output: {
    path: __dirname + '/dist/',
    filename: '[name].js',
    publicPath : 'dist',
  },
  devServer:{
    contentBase: __dirname,
    before (app) {
      app.use('/assets', express.static(resolve(__dirname, 'playground', 'assets')));
    },
    disableHostCheck: true,
  },
  devtool: 'source-map',
};
