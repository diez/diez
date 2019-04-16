import {CompilerTargetProvider} from '@diez/compiler';
import {androidHandler as handler} from './android.handler';

const target: CompilerTargetProvider = {
  handler,
  name: 'android',
};

export = target;
