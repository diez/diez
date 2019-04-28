import {CompilerTargetProvider} from '../src/api';

const target: CompilerTargetProvider = {
  handler: jest.fn(),
  name: 'test',
};

export = target;
