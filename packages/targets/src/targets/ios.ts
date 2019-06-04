import {CompilerTargetProvider} from '@diez/compiler';
import {Target} from '@diez/engine';
import {iosHandler as handler} from './ios.handler';

const target: CompilerTargetProvider = {
  handler,
  name: Target.Ios,
};

export = target;
