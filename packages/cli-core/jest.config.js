const {jestRoot} = require('@diez/test-utils');

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
  moduleNameMapper: {
    '^starting-point$': '<rootDir>/test/fixtures/starting-point',
    '^command-provider$': '<rootDir>/test/fixtures/command-provider',
    '^command-extender$': '<rootDir>/test/fixtures/command-extender',
  },
};
