import {join} from 'path';

// tslint:disable-next-line: no-var-requires
const Module = require('module');
const originalNodeModulePaths = Module._nodeModulePaths;

export const resolveFixtureModules = () => {
  Module._nodeModulePaths = (dirname: string) => originalNodeModulePaths(dirname).concat([join(__dirname, 'fixtures')]);
};

export const restoreModules = () => {
  Module._nodeModulePaths = originalNodeModulePaths;
};
