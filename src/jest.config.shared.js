const {join} = require('path');

module.exports = {
  testEnvironment: 'node',
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
    [`^${join(global.process.cwd(), 'lib')}(.*)`]: '<rootDir>/src$1',
  },
};
