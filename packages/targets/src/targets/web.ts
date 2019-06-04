import {CompilerTargetProvider} from '@diez/compiler';
import {Target} from '@diez/engine';
import {webHandler as handler} from './web.handler';

const target: CompilerTargetProvider = {
  handler,
  name: Target.Web,
};

export = target;
