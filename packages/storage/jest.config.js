const {jestRoot} = require('@livedesigner/test-utils');

module.exports = {
  roots: [
    '<rootDir>/test',
    jestRoot,
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  testRegex: 'test\.tsx?$',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
};
