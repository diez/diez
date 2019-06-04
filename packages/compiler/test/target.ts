import {Target} from '@diez/engine';
import {CompilerTargetProvider} from '../src/api';

const target: CompilerTargetProvider = {
  handler: jest.fn(),
  name: 'test' as Target,
};

export = target;
