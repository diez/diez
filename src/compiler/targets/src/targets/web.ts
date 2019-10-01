import {CompilerProvider} from '@diez/compiler-core';
import {Target} from '@diez/engine';
import {webHandler as handler} from './web.compiler';

const target: CompilerProvider = {
  handler,
  name: Target.Web,
};

export = target;
