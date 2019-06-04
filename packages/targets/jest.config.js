const {resolve} = require('path');

module.exports = {
  roots: [
    '<rootDir>/test',
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
  globals: {
    'ts-jest': {
      tsConfig: 'test/tsconfig.json',
    },
  },
  moduleNameMapper: {
    [`^${resolve(__dirname, 'lib')}/(.*)`]: '<rootDir>/src/$1',
  },
};
