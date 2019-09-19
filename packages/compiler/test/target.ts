import {Target} from '@diez/engine';
import {CompilerProvider} from '../src/api';

const target: CompilerProvider = {
  handler: jest.fn(),
  name: 'test' as Target,
};

export = target;
