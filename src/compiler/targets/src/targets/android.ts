import {CompilerProvider} from '@diez/compiler-core';
import {Target} from '@diez/engine';
import {androidHandler as handler} from './android.compiler';

const target: CompilerProvider = {
  handler,
  name: Target.Android,
};

export = target;
