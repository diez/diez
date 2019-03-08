const {join} = require('path');
const Module = require('module');

module.exports = () => {
  Module._nodeModulePaths = () => [join(__dirname, 'fixtures')];
};
