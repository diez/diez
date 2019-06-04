import {CompilerTargetProvider} from '@diez/compiler';
import {Target} from '@diez/engine';
import {androidHandler as handler} from './android.handler';

const target: CompilerTargetProvider = {
  handler,
  name: Target.Android,
};

export = target;
