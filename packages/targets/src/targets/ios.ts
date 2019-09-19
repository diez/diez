import {CompilerProvider} from '@diez/compiler';
import {Target} from '@diez/engine';
import {iosHandler as handler} from './ios.handler';

const target: CompilerProvider = {
  handler,
  name: Target.Ios,
};

export = target;
