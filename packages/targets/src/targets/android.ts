import {CompilerProvider} from '@diez/compiler';
import {Target} from '@diez/engine';
import {androidHandler as handler} from './android.handler';

const target: CompilerProvider = {
  handler,
  name: Target.Android,
};

export = target;
