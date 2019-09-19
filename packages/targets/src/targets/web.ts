import {CompilerProvider} from '@diez/compiler';
import {Target} from '@diez/engine';
import {webHandler as handler} from './web.handler';

const target: CompilerProvider = {
  handler,
  name: Target.Web,
};

export = target;
